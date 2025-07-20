//getRecommendedHomepages
'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { userLocation } = event;
  const userLat = userLocation.latitude;
  const userLng = userLocation.longitude;

  // 1. 拉出所有候选 (Pull all candidates)
  const res = await db.collection('Homepage').get();
  const list = res.data || [];

  // 2. 过滤 & 打分 (Filter & Score)
  const now = Date.now();
  // 先算出最大评论数 Cmax 和最大点赞数 Lmax 用于归一化
  // (First calculate Cmax for max comments and Lmax for max likes for normalization)
  let Cmax = 0, Lmax = 0;
  list.forEach(item => {
    const cnt = (item.comments || []).length;
    Cmax = Math.max(Cmax, cnt);
    Lmax = Math.max(Lmax, item.likeCount || 0);
  });

  const scored = list
    .map(item => {
      // 2.1 服务范围 & 距离计算 (Service Range & Distance Calculation)
      const d = haversine(userLat, userLng, item.latitude, item.longitude);

      // 确定该工人的有效最大服务距离 (Determine the effective maximum service distance for this worker)
      // 如果 item.maxServiceDistance 是一个有效数字且 >= 0，则使用它。
      // 否则，默认为 10 公里。
      // (If item.maxServiceDistance is a valid number and >= 0, use it. Otherwise, default to 10km.)
      const effectiveServiceDistance = item.maxServiceDistance != null && typeof item.maxServiceDistance === 'number' && item.maxServiceDistance >= 0
                                       ? item.maxServiceDistance
                                       : 10; // Default to 10km

      // 如果实际距离 d 超过了有效服务距离，则直接剔除该工人。
      // 这是硬性过滤，确保用户只能看到在其服务范围内的工人。
      // (If the actual distance 'd' exceeds the effective service distance, directly filter out this worker.
      // This is a hard filter to ensure users only see workers within their service range.)
      if (d > effectiveServiceDistance) {
        return null; // 超出服务范围，剔除 (Exceeds service range, filter out)
      }
      
      // 2.2 距离得分 (Sd) 优化逻辑 (Optimized Distance Score (Sd) Logic)
      let Sd;
      if (d <= 10) {
          // 0-10公里：分数从1线性下降到0 (0-10km: Score linearly decreases from 1 to 0)
          Sd = 1 - d / 10;
      } else if (d <= 20) {
          // 10-20公里：分数保持为0 (不给正分) (10-20km: Score remains 0 (no positive contribution))
          Sd = 0;
      } else {
          // 20公里以上：开始给负分，距离越远负分越多
          // (20km+: Starts giving negative scores, further distance means more negative score)
          // 这里使用 (d - 20) / 50 来计算负分，你可以根据实际效果调整分母的数值 (50)
          // (Here, (d - 20) / 50 is used to calculate the negative score. You can adjust the denominator (50) based on actual effect.)
          // 分母越大，负分增长越慢，惩罚越轻；分母越小，负分增长越快，惩罚越重。
          // (Larger denominator: slower negative score increase, lighter penalty; smaller denominator: faster negative score increase, heavier penalty.)
          Sd = -(d - 20) / 50; 
      }

      // 2.3 评论口碑 (Sr) (Comment Reputation Score (Sr))
      const comments = item.comments || [];
      const commentCount = comments.length;
      const avgRating = commentCount
        ? comments.reduce((s,c)=>s + c.rating, 0) / commentCount
        : 0;
      const countScore = commentCount
        ? Math.log(1 + commentCount) / Math.log(1 + Cmax)
        : 0;
      const ratingScore = avgRating / 5;
      const Sr = (countScore + ratingScore) / 2;

      // 2.4 新鲜度（Sc） (Freshness Score (Sc))
      const lastTs = commentCount
        ? Math.max(...comments.map(c => c.createdAt))
        : 0;
      const daysAgo = (now - lastTs) / (1000*60*60*24);
      const Sc = Math.max(0, 1 - daysAgo/30);

      // 2.5 点赞得分 (Sl) (Like Score (Sl))
      const Sl = (item.likeCount || 0)
        ? Math.log(1 + item.likeCount) / Math.log(1 + Lmax)
        : 0;

      // 3. 加权汇总 (Weighted Sum)
      // 示例权重：0.4 评论，0.25 新鲜，0.2 距离，0.15 点赞
      // (Example weights: 0.4 comments, 0.25 freshness, 0.2 distance, 0.15 likes)
      const score = 0.4*Sr + 0.25*Sc + 0.2*Sd + 0.15*Sl;

      return { ...item, distance: d, score };
    })
    .filter(x => x)               // 去掉 null (被 effectiveServiceDistance 过滤掉的) (Remove nulls (filtered by effectiveServiceDistance))
    .sort((a,b) => b.score - a.score); // 按分数降序 (Sort by score in descending order)

  return {
    code: 0,
    data: scored,
    message: '推荐完成'
  };
};

// 直线距离计算函数 (Haversine distance calculation function)
function haversine(lat1, lon1, lat2, lon2) {
  const rad = d => (d * Math.PI) / 180;
  const R = 6371; // 地球半径km (Earth radius in km)
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2
          + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// uniCloud/cloudfunctions/deleteFile/index.js
'use strict';
exports.main = async (event, context) => {
  // 注意：在云函数中，uniCloud 对象可以直接访问
  // 如果你的环境需要明确引入，可以尝试：
  // const uniCloud = require('uni-cloud-sdk');
  // const cloud = uniCloud; // 或者 uniCloud.cloud

  // 最常用的方式是直接使用 uniCloud 对象，它包含了 cloud 能力
  // 确保你的云函数服务空间已开通云存储。

  const { fileId } = event; // 从前端接收要删除的 fileId

  if (!fileId) {
    return {
      success: false,
      error: 'fileID is required',
      message: '缺少文件ID'
    };
  }

  try {
    // 确保直接通过 uniCloud 对象调用 deleteFile
    const res = await uniCloud.deleteFile({
      fileList: [fileId] // uniCloud.deleteFile 期望一个文件 ID 数组
    });

    // 检查是否成功删除文件
    if (res.fileList && res.fileList.length > 0) {
      return {
        success: true,
        deleted: res.fileList,
        message: `文件 ${fileId} 删除成功`
      };
    } else {
      return {
        success: false,
        error: '文件未被删除或文件不存在',
        message: '文件删除操作可能未生效'
      };
    }
  } catch (e) {
    console.error('云函数 deleteFile 错误:', e);
    return {
      success: false,
      error: e.message,
      message: '云存储文件删除失败'
    };
  }
};
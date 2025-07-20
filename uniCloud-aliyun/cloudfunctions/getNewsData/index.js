'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  return await db.collection('NewsData').orderBy('serial_number', 'asc').limit(5).get();
}; 
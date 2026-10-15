// src/utils/formatters.js

/**
 * 十進位經緯度 → 度分秒字串
 * @param {number} decimal 例如 120.524322
 * @returns {string} 例如 120°31'27.56"
 */
export function formatDMS(decimal) {
 
  let degrees =Math.floor(decimal)

 
  const minutesFull = (decimal - degrees) * 60
  let minutes = Math.floor(minutesFull)


  let seconds = Math.round((minutesFull - minutes) *60 *100)/100

 
  if(seconds >= 60){
	seconds = 0
	minutes += 1
  }
  if(minutes >= 60){
	degrees += 1
	minutes = 0
  }

  return `${degrees}°${minutes}'${seconds.toFixed(2)}"`
}


/**
 * ISO 時間字串 → 2026/10/14 下午7:30:32
 * @param {string} iso 例如 '2026-10-14T19:30:32+08:00'
 */
export function formatDateTime(iso) {

  return new Date(iso).toLocaleString('zh-TW',{ timeZone: 'Asia/Taipei' })
}
let dataUsagePerSeconds = {
  '240p': '62.5KB'
  , '360p': '87.5KB'
  , '480p': '156.25KB'
  , '720p at 30FPS': '343.75KB'
  , '720p at 60FPS': '515.625KB'
  , '1080p at 30FPS': '563.8888888888889KB'
  , '1080p at 60FPS': '844.4444444444443KB'
  , '1440p at 30FPS': '1.1888888888888887MB' // (2K)
  , '1440p at 60FPS': '1.6888888888888887MB' // (2K)
  , '2160p at 30FPS': '2.938888888888889MB' // (4K)
  , '2160p at 60FPS': '4,438888888888889MB' // (4K)
}

let HMStoSeconds = (hms) => {
  let a = hms.split(':')
  let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
  return seconds
}

let bytesToSize = (bytes) => {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)))
  return Math.round(bytes / Math.pow(1000, i), 2) + '' + sizes[i]
};

let sizeToBytes = (size, unity) => {
  let bytes
  if (unity == 'TB') {
    bytes = size * Math.pow(1000, 4)
  } else if (unity == 'GB') {
    bytes = size * Math.pow(1000, 3)
  } else if (unity == 'MB') {
    bytes = size * Math.pow(1000, 2)
  } else if (unity == 'KB') {
    bytes = size * 1000
  }
  return bytes
};

let calculate = (qualityVideo, durationVideo, nVideos = 1) => {
  if (nVideos == '') nVideos = 1

  let durationVideoSeconds = HMStoSeconds(durationVideo)
  let dataUsagePerSecondsVideo = dataUsagePerSeconds[qualityVideo]

  dataUsagePerSecondsVideo = dataUsagePerSecondsVideo.split('')
  unity = dataUsagePerSecondsVideo.splice(-2).join('')
  dataUsagePerSecondsVideo = parseFloat(dataUsagePerSecondsVideo.join(''))

  let result = (dataUsagePerSecondsVideo * durationVideoSeconds * nVideos)
  result = bytesToSize(sizeToBytes(result, unity))

  return result
}

// 144p: No bitrate provided by YouTube.
// 240p: 225MB per hour
// 360p: 315MB per hour
// 480p: 562.5MB per hour
// 720p at 30FPS: 1237.5MB (1.24GB) per hour
// 720p at 60FPS: 1856.25MB (1.86GB) per hour
// 1080p at 30FPS: 2.03GB per hour
// 1080p at 60FPS: 3.04GB per hour
// 1440p (2K) at 30FPS: 4.28GB per hour
// 1440p (2K) at 60FPS: 6.08GB per hour
// 2160p (4K) at 30FPS: 10.58GB per hour
// 2160p (4K) at 60FPS: 15.98GB per hour

// https://www.makeuseof.com/tag/how-much-data-does-youtube-use/

['duration-video', 'quality-video', 'n-video'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', function (e) {
    if ( [document.getElementById('duration-video').value, document.getElementById('quality-video').value].every(val => val !== '') ) {
      let result = calculate(document.getElementById('quality-video').value, document.getElementById('duration-video').value.padEnd(8, ':00'), document.getElementById('n-video').value)

      document.getElementById('result').innerHTML = result
    }
  })
})
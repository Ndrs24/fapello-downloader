import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { existGirl, getLinkImage, getLinkVideo, toSecureName } from 'fapello'
import chalk from 'chalk'

async function fpdownload(name, limit, outputDir = './downloads') {
  name = toSecureName(name)
  const {exist, num} = await existGirl(name)
  if (!exist) return console.log(chalk.bold.red('[Fapello Downloader] Girl not exist'))
  
  limit = limit > num ? num : limit
  outputDir = `${outputDir}/${name}`

  if (!existsSync(outputDir))
      await mkdir(outputDir, { recursive: true })

  for(let i = 1; i <= limit; i++) {
    const fileName = `${outputDir}/${name}-${i}`
    const fileImage = `${fileName}.jpg`
    const fileVideo = `${fileName}.mp4`

    if (!existsSync(fileVideo) && !existsSync(fileImage)) {
      const srcVideo = getLinkVideo(name, i)
      const resultVideo = await fetch(srcVideo)

      if (resultVideo.ok) {
        const dataVideo = await resultVideo.arrayBuffer()
        await writeFile(fileVideo, new DataView(dataVideo))
      } else {
        const srcImage = getLinkImage(name, i)
        const resultImage = await fetch(srcImage)
        const dataImage = await resultImage.arrayBuffer()
        await writeFile(fileImage, new DataView(dataImage))
      }
    }
    
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0); 
    process.stdout.write(chalk.bold.blueBright(`[Fapello Downloader] Progress: ${Math.floor(((i)*100)/limit)}% (${(i)}/${limit})`));
  }

  console.log(chalk.bold.green('\n[Fapello Downloader] Finished'))
}

(async () => {
  await fpdownload('gigardez', 255)
})()
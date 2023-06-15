import path from 'path';
import { Worker } from 'worker_threads';
import { readdir } from 'fs/promises'

const directoryPath = process.argv[2];
if (process.argv.length < 3) {
  console.error('Not given the path to the folder')
  process.exit(1)
}

const csvFilesArray = await readdir(directoryPath);

let numThreads = 0;
let worker;
let x = 0;
if (csvFilesArray.length <= 10) {

  numThreads = csvFilesArray.length;
  for (let i = 0; i < numThreads; i++) {
    worker = new Worker('./worker.js');
    ++x
  }
  worker.on('online', (message) => {
    for (let j = 0; j < csvFilesArray.length; j++) {
      const csvFilePath = path.join(directoryPath, csvFilesArray[j])
      worker.postMessage(csvFilePath);
    }
  });

} else {

  numThreads = 10;
  for (let i = 0; i < numThreads; i++) {
    worker = new Worker('./worker.js');
    ++x
  }
  worker.on('online', (message) => {
    for (let j = 0; j < csvFilesArray.length; j++) {
      const csvFilePath = path.join(directoryPath, csvFilesArray[j])
      worker.postMessage(csvFilePath);
    }
  });

}

console.log('threads number is >>', x)
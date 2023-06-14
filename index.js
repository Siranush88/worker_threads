//import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { readdir } from 'fs/promises'

const directoryPath = process.argv[2];
if (process.argv.length < 3) {
  console.error('Not given the path to the folder')
  process.exit(1)
}

const csvFilesArray = await readdir(directoryPath);

const numThreads = csvFilesArray.length;


let worker;
for (let i = 0; i < numThreads; i++) {
  worker = new Worker('./worker.js');
}


worker.on('online', (message) => {
  for (let i = 0; i < csvFilesArray.length; i++) {
    const csvFilePath = path.join(directoryPath, csvFilesArray[i])
    worker.postMessage(csvFilePath);
  }
});


// worker.on('message', (error) => {
//   worker.terminate();
// });


// //  else {
// //   // If the script is not in the main thread, parse a single CSV file
// //   const filePath = workerData;
// //   parseCSVFile(filePath)
// //     .then((result) => {
// //       // Send the parsed data back to the main thread
// //       parentPort.postMessage(result);
// //     })
// //     .catch((err) => {
// //       console.error('Error parsing CSV file:', err);
// //       process.exit(1);
// //     });
// // }
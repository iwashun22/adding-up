'use strict';
const fs = require('fs');
const readline = require('readline');

const prefectureDataMap = new Map();

const rs = fs.createReadStream('./popu-pref.csv');
// @ts-ignore
const rl = readline.createInterface(
   { 
      input: rs, 
      output: {} 
   }
);

rl.on('line', lineString => {
   const column = lineString.split(',');
   const year = parseInt(column[0]);
   const prefecture = column[1];
   const population = parseInt(column[3]);
   if(year === 2010 || year === 2015){
      let value = prefectureDataMap.get(prefecture);
      if(!value){
         value = {
            popu10: 0,
            popu15: 0,
            change: null
         };
      }
      year === 2010 ?
         value.popu10 = population :
         value.popu15 = population;

      prefectureDataMap.set(prefecture, value);
   }
})

rl.on('close', () => {
   for(const [key, value] of prefectureDataMap){
      value.change = value.popu15 / value.popu10;
   }
   const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
   })
   const rankingString = rankingArray.map(([key, value]) => {
      return (
         key +
         ': ' +
         value.popu10 +
         ' => ' +
         value.popu15 +
         ' 変化率: ' +
         value.change
      );
   })

   console.log(rankingString);
})
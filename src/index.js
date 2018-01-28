import fs from 'fs';
import Deflator from './deflator';
import Inflator from './inflator';

let deflator = new Deflator(40);

const filePath = './images/IMG-1.jpg';
const image = deflator.microsizeSync(filePath, 'base64');

const inflator = new Inflator(deflator.getHeader('base64'), deflator.getFooter('base64'));

console.log(deflator.getHeader('base64'));
console.log(deflator.getFooter('base64'));

let dataUri = inflator.inflate(image, 32, 32);
//console.log(dataUri);

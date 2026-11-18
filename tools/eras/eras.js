const fs=require('fs');
module.exports=fs.readdirSync(__dirname).filter(f=>/^eras_.*\.js$/.test(f)).map(f=>require('./'+f));

let execSync = require('child_process').execSync;
let fs = require("fs");
let path = require("path");

function proConfig(filepath) {
    let filePath = path.resolve(filepath);
    // 调用文件遍历方法
    // fileGet(filePath);
    fileGet(filePath);  
}

// 调用文件遍历方法
function fileGet(filePath) {
    // 根据文件路径读取文件
    let files = fs.readdirSync(filePath);
    // 遍历读取到的文件列表
    files.forEach(filename => {
        // 获取当前文件的绝对路径
        let filedir = path.join(filePath, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        let stats = fs.statSync(filedir);
        // console.log(stats);
        let isFile = stats.isFile(); // 是文件
        let isDir = stats.isDirectory(); // 是文件夹
        if (isFile && filename!="config.json") {
            bwGet(filedir);
        }
        if (isDir) {
            fileGet(filedir); //如果是文件夹，递归执行，获取文件
        }
    })
}

// let cmdStr = 'jbrowse add-track .\tracks\monoDNAOri\chrXVI_MD0001_EIIP.bw --type "WiggleTrack" --name "chrXVI_MD0001_EIIP_original" --category "EIIP" --skipCheck --load inPlace';

function bwGet(filename) {
    let basename = path.basename(filename, ".bw"); // 如 chrII_DD0060_Shift_rise
    let valuetype = path.basename(path.dirname(filename)); // 如 diDNASta
    let valueT = valuetype.substring(valuetype.length - 3); // 如 Sta
    let type = "WiggleTrack";
    let name;
    if (valueT == "Sta") {
        name = basename + "_standardized";
    } else if (valueT == "Ori") {
        name = basename + "_original";
    }
    let category = basename.substring(basename.indexOf("_") + 8); // DD0000 , MD0000, TD0000都是6位，加上理化特性名称前的_总共是 7 位，最终获取理化特性名称
    console.log(basename, valuetype, valueT, name, category);
    let out = path.dirname(filename);
    let cmdStr = "jbrowse add-track \"" + filename + "\" --type " + type + " --name \"" + name + "\" --category \"" + category + "\" --skipCheck --load inPlace --out " + out;
    execSync(cmdStr);
}

proConfig("F:\\VScode\\VisGenome\\visgenome-backend\\public\\files\\saccer3\\tracks");
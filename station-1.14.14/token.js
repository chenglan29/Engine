// 模块化导出函数，接收参数 len（指定随机字符串长度）
module.exports = (len) => {
    var res = ""; // 初始化空字符串，用于存储最终生成的随机字符串
    // 循环 len 次，每次生成一个符合要求的字符，拼接至 res 中
    for(var i = 0;i<len;i++){
        // 生成 0-255 之间的随机整数（ASCII 码范围）
        var a = Math.floor(Math.random()*256);
        // 判断生成的 ASCII 码是否属于目标字符范围（数字、大写字母、小写字母）
        if(
            (a >= 48 && a <= 57) || // 数字 0-9 的 ASCII 码范围（48=0，57=9）
            (a >= 65 && a <= 90) || // 大写字母 A-Z 的 ASCII 码范围（65=A，90=Z）
            (a >= 97 && a <= 122)   // 小写字母 a-z 的 ASCII 码范围（97=a，122=z）
        )res += String.fromCodePoint(a); // 符合要求，将 ASCII 码转为对应字符并拼接
        else i--; // 不符合要求，计数器 i 减 1，重新生成该位置的字符
    }
    return res; // 循环结束，返回生成的随机字符串
}
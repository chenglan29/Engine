module.exports = (len) => {
    var res = "";
    for(var i = 0;i<len;i++){
        var a = Math.floor(Math.random()*256);
        if(
            (a >= 48 && a <= 57) || 
            (a >= 65 && a <= 90) || 
            (a >= 97 && a <= 122)
        )res += String.fromCodePoint(a);
        else i--;
    }
    return res;
}
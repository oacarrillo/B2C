//OAC - Formato de valores numericos
function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    return amount_parts.join('.');
} 
//OAC - Captura variables por get
function getVar(){
    query=window.location.search.substring(1);
    q=query.split("&");
    var prodId=0;
    vars=[];
    for(i=0;i<q.length;i++){
        x=q[i].split("=");
        k=x[0];
        v=x[1];
        vars[k]=v;
        prodId=v;
        return prodId;
    }
}
 //OAC - Busca productos por campo de paginas
function buscar(){
    var porId=document.getElementById("find").value;        
    var porId=porId.replace("*","");//remplaza expresion regular
    if(porId.length>0){
        sessionStorage.prodFind ="http://kallsonyproducto.azurewebsites.net/kallsony/productos/busqueda/descripcion/"+porId;
    }
    else{
        alert("Por favor ingrese un criterio de busqueda");
    }
}

//cierra sesion de usuario
function sesion() {
    sessionStorage.jsonPost="";
    sessionStorage.tokenUser="";
    sessionStorage.numeroProds="0";//cero el numero de productos
    sessionStorage.valorProds="0";//cero el numero de productos
    sessionStorage.prodCar="";//vacia carrito de productos
    window.location.assign("index.html");
}


function login() {
    var user=document.getElementById("loginuser").value;
    var pass=document.getElementById("loginpass").value;

    //user="oscarcarrillo";
    //pass="123456";

    if(user.length>0 && pass.length>0){    
            console.log("user:"+user);
            console.log("pass:"+pass);        
            var data = JSON.stringify({"username":""+user+"","password":""+pass+""});
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                //console.log("con:"+this.responseText);
                var obj = JSON.parse(this.responseText);
                if(obj.token!="fail"){
                    sessionStorage.jsonPost=this.responseText;
                    location.reload();
                }else{
                    alert("Usuario o clave invalida")
                }
              }
            });
            xhr.open("POST", "http://35.184.218.7:8080/SERVICES_OMS/loginService/validarLogin");
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send(data);
    }
    else{
        alert("Ingrese una usuario y contraseña validos");
        document.getElementById("loginuser").value="";
        document.getElementById("loginpass").value="";
    }
}  


//Muestra form login modal
 function showLogin(){
    $("#id01").css("display", "block");
}

function funCiudad(){
    
    var pais=document.getElementById("pais").value;
    sessionStorage.pais=pais;
    codPais(pais);
    if(pais=="BRAZIL"){pais="3";}
    if(pais=="USA"){pais="2";}
    if(pais=="COLOMBIA"){pais="1";}

    
    var texto4="";
    $.getJSON("http://35.184.218.7:8080/SERVICES_OMS/geoService/ciudades/"+pais, function(datos4){

        texto4+="<tr><td>* Ciudad&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>";
        texto4+="<select id='ciudad' onchange='funNombreCiudad()'>";
        texto4+="<option></option>";
        $.each(datos4, function(i,item){
            texto4+="<option>"+datos4[i].ciudadNombre+"</option>";
        });
        texto4+="</select>"
       
        $("#ciudades").html(texto4);
  }); 
}

function funNombreCiudad(){
    sessionStorage.ciudad=document.getElementById("ciudad").value;
    codCiudad(sessionStorage.ciudad);

    console.log("pais:"+sessionStorage.pais);
    console.log("ciudad:"+sessionStorage.ciudad);
    console.log("codpais:"+sessionStorage.codPais);
    console.log("codciudad:"+sessionStorage.codCiudad);    
}

function codPais(pais){
    if(pais=="BRAZIL"){sessionStorage.codPais="3";}
    if(pais=="USA"){sessionStorage.codPais="2";}
    if(pais=="COLOMBIA"){sessionStorage.codPais="1";}
}

function codCiudad(ciudad){
    if(ciudad=="ARMENIA"){sessionStorage.codCiudad="27";}
    if(ciudad=="BARRANQUILLA"){sessionStorage.codCiudad="23";}
    if(ciudad=="BOGOTA"){sessionStorage.codCiudad="1";}
    if(ciudad=="CALI"){sessionStorage.codCiudad="24";}
    if(ciudad=="CÚCUTA"){sessionStorage.codCiudad="25";}
    if(ciudad=="MEDELLIN"){sessionStorage.codCiudad="22";}
    if(ciudad=="POPAYAN"){sessionStorage.codCiudad="26";}
    if(ciudad=="FLORIDA"){sessionStorage.codCiudad="28";}
    if(ciudad=="NEW YORK"){sessionStorage.codCiudad="29";}
    if(ciudad=="TEXAS"){sessionStorage.codCiudad="30";}
    if(ciudad=="WASHINGTON"){sessionStorage.codCiudad="21";}
    if(ciudad=="BELLO HORIZONTE"){sessionStorage.codCiudad="34";}
    if(ciudad=="RIO DE JANEIRO"){sessionStorage.codCiudad="32";}
    if(ciudad=="SALVADOR"){sessionStorage.codCiudad="33";}
    if(ciudad=="SAO PAULO"){sessionStorage.codCiudad="31";}
}
//carga perfil de cliente al iniciar la pagina
function load(){
    
    if(sessionStorage.jsonPost){
        console.log("Con sesion");      
        var obj = JSON.parse(sessionStorage.jsonPost);
        var textlogin2="";
        textlogin2+="<li id='lisesion' style='display: inline'><a href='javascript:sesion();'>Cerrar Sesión</a></li>";
        textlogin2+="<li id='liorden' style='display: inline'><a href='ordenes.html'>Mis Ordenes</a></li>";
        textlogin2+="<li id='liperfil' style='display: inline'><a href='profile.html'>Perfil</a></li>";
        $("#concar").css("display", "block");//carrito de compras muestra
        $("#addcar").css("display", "block"); ////agregar al carrito muestra
        $("#divLogin").html(textlogin2);     
        $("#nameusuario").html(obj.username);
        sessionStorage.tokenUser=obj.token;
        sessionStorage.tarjetaUser=obj.tarjeta;
        console.log(sessionStorage.tokenUser);
        //console.log(sessionStorage.jsonPost);
    }
    else{
        console.log("Sin sesion");
        var textlogin="";
        $("#concar").css("display", "none");//carrito de compras oculta
        $("#addcar").css("display", "none"); //agregar al carrito oculto  
        textlogin+="<li id='liregistro' style='display: inline'><a href='register.html'>Registro</a></li>";    
        textlogin+="<li id='lilogin' style='display: inline'><a href='javascript:showLogin();'>Login</a></li>";
        $("#divLogin").html(textlogin);        
    }

    //Ventana modal del login
    var modal = document.getElementById('id01');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }  

    if(!sessionStorage.inProds){
        sessionStorage.numeroProds="0";
        sessionStorage.valorProds="0";
        sessionStorage.inProds="1";//Solo lo hace una vez
    }
    //carga valores de items y valor en el carrito
    if(sessionStorage.prodCar){
        var text="";
        var prods = sessionStorage.prodCar.split("|");//separa los productos
        text+=sessionStorage.numeroProds+" producto(s) - "+number_format(sessionStorage.valorProds)+"&nbsp&nbsp";
        text+="<button class='myButtonCar' onclick='pagePagar()'><b>Ir a Pagar</b></button>";
        text+="<ul class='dropdown'>";
        text+="<div>";
        for (i=0; i < prods.length; i++){        
            prod = prods[i].split(";");
            text+="<li>"+prod[0]+" - "+number_format(prod[1])+" - "+prod[2]+" item(s)</li>";
        }
        text+="</div>";
        text+="</ul>";
        $("#dd").html(text);
    }
}

//carga los datos del carrito
function calculoResumenCar(){
    sessionStorage.numeroProds=0;
    sessionStorage.valorProds=0;
    var prod;
    var intTemp=0;

    var prods = sessionStorage.prodCar.split("|");//separa los productos
    for (var i=0; i < prods.length; i++){
        prod = prods[i].split(";");//separa un solo producto
        intTemp=parseInt(sessionStorage.valorProds)+(parseInt(prod[1]))*parseInt(prod[2]);
        sessionStorage.valorProds=intTemp.toString();
        intTemp=parseInt(sessionStorage.numeroProds)+parseInt(prod[2]);
        sessionStorage.numeroProds=intTemp.toString();
    }   
    var text="";
    text+=sessionStorage.numeroProds+" producto(s) - "+number_format(sessionStorage.valorProds)+"&nbsp&nbsp";
    text+="<button class='myButtonCar' onclick='pagePagar()'><b>Ir a Pagar</b></button>";
    text+="<ul class='dropdown'>";
    text+="<div>";
    for (i=0; i < prods.length; i++){        
        prod = prods[i].split(";");
        text+="<li>"+prod[0]+" - "+number_format(prod[1])+" - "+prod[2]+" item(s)</li>";
    }
    text+="</div>";
    text+="</ul>";
    $("#dd").html(text);
}

//funcion que abre pagina de pagos
function pagePagar(){
    window.location.assign("pay.html");  
}


function Tipoid(valor){
    //alert("in:"+valor);
    var retorno="";
    if(valor=="Cédula de ciudadania"){retorno="CEDULA_CIUDADANIA";}
    if(valor=="Registro unico tributario"){retorno="REGISTRO_UNICO_TRIBUTARIO";}
    if(valor=="Cédula de extranjeria"){retorno="CEDULA_EXTRANJERIA";}
    //alert("ret:"+retorno);
    return retorno;
}

function TipoIdCombo(valor){
    //alert("in:"+valor);
    var retorno="";
    if(valor=="CEDULA_CIUDADANIA"){retorno="Cédula de ciudadania";}
    if(valor=="REGISTRO_UNICO_TRIBUTARIO"){retorno="Registro unico tributario";}
    if(valor=="CEDULA_EXTRANJERIA"){retorno="Cédula de extranjeria";}
    return retorno;
}

var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  } 
  return rhex(a) + rhex(b) + rhex(c) + rhex(d); 
}






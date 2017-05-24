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

function enviarPost(url,json){
    alert("Entre");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        console.log(xhr.readyState);
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("entre log");
            console.log("en str:"+xhr.responseText);
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            //sessionStorage.jsonPost = xhr.responseText;
            //alert(sessionStorage.jsonPost);
            //console.log(sessionStorage.jsonPost);
        }
    };
    var data = json;//JSON.stringify({"email": "hey@mail.com", "password": "101010"});
    xhr.send(data);
}

//cierra sesion de usuario
function sesion() {
    sessionStorage.jsonPost="";
    sessionStorage.tokenUser="";
    sessionStorage.numeroProds="0";//cero el numero de productos
    sessionStorage.valorProds="0";//cero el numero de productos
    sessionStorage.prodCar="";//vacia carrito de productos
    location.reload();
}


function login() {

    var user="oscarcarrillo";
    var pass=123456;

    var data = JSON.stringify({"username":""+user+"","password":pass});
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log("msg:"+this.responseText);
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


//Muestra form login modal
 function showLogin(){
    $("#id01").css("display", "block");
}


//carga perfil de cliente al iniciar la pagina
function load(){
    
    if(sessionStorage.jsonPost){
        console.log("Con sesion");      
        var obj = JSON.parse(sessionStorage.jsonPost);
        var textlogin2="";
        textlogin2+="<li id='lisesion' style='display: inline'><a href='javascript:sesion();'>Cerrar Sesión</a></li>";
        textlogin2+="<li id='liorden' style='display: inline'><a href='#''>Mis Ordenes</a></li>";
        $("#concar").css("display", "block");//carrito de compras muestra
        $("#addcar").css("display", "block"); ////agregar al carrito muestra
        $("#divLogin").html(textlogin2);     
        $("#nameusuario").html(obj.username);
        sessionStorage.tokenUser=obj.token;
        console.log(sessionStorage.tokenUser);
        console.log(sessionStorage.jsonPost);
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
        text+="<button class='myButtonCar' onclick='pagar()'><b>Ir a Pagar</b></button>";
        text+="<ul class='dropdown'>";
        text+="<div>";
        for (i=0; i < prods.length; i++){        
            prod = prods[i].split(";");
            text+="<li>"+prod[0]+" - "+number_format(prod[1])+" - "+prod[2]+" item(s)</li>";
        }
        text+="</div>";
        text+="<button id='envioPeticiona' class='myButtonCar' onclick='pagar()'><b>Ir a Pagar</b></button>";
        text+="</ul>";
        $("#dd").html(text);
    }
}

function calculoResumenCar(){
    sessionStorage.numeroProds=0;
    sessionStorage.valorProds=0;
    var prod;
    var intTemp=0;

    var prods = sessionStorage.prodCar.split("|");//separa los productos
    for (var i=0; i < prods.length; i++){
        prod = prods[i].split(";");//separa un solo producto
        intTemp=parseInt(sessionStorage.valorProds)+parseInt(prod[1]);
        sessionStorage.valorProds=intTemp.toString();
        intTemp=parseInt(sessionStorage.numeroProds)+parseInt(prod[2]);
        sessionStorage.numeroProds=intTemp.toString();
    }   
    var text="";
    text+=sessionStorage.numeroProds+" producto(s) - "+number_format(sessionStorage.valorProds)+"&nbsp&nbsp";
    text+="<button class='myButtonCar' onclick='pagar()'><b>Ir a Pagar</b></button>";
    text+="<ul class='dropdown'>";
    text+="<div>";
    for (i=0; i < prods.length; i++){        
        prod = prods[i].split(";");
        text+="<li>"+prod[0]+" - "+number_format(prod[1])+" - "+prod[2]+" item(s)</li>";
    }
    text+="</div>";
    text+="<button id='envioPeticiona' class='myButtonCar' onclick='pagar()'><b>Ir a Pagar</b></button>";
    text+="</ul>";
    $("#dd").html(text);


}






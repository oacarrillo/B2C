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
    sessionStorage.prodFind ="http://kallsonyproducto.azurewebsites.net/kallsony/productos/busqueda/descripcion/"+porId;
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
    location.reload();
}

//Login de usuario
function login() {
    var user=document.getElementById("loginuser").value;
    var pass=document.getElementById("loginpass").value;
    if(user.length>0 && pass.length>0){
        var text = '{"username": "oscarcarrillo","password": 123456}';
        var url="http://35.184.218.7:8080/SERVICES_OMS/loginService/validarLogin";
        //enviarPost(url,text);
/*
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //var json = JSON.parse(xhr.responseText);
                var json = xhr.responseText;
                console.log(json);
            }
        };
        var data = JSON.stringify(text);
        xhr.send(data);
*/
        var text='{'+
          '"id": 0,'+
          '"password": "LvxBN5EW7bg=",'+  
          '"idUsuario": null,'+
          '"tipoUsuario": null,'+  
          '"estado": null,'+
          '"username": "oscarcarrillo",'+
          '"ownerid": null,'+
          '"token": "S8zCNuZWKTc="'+
        '}';

        //console.log(json);
        sessionStorage.jsonPost=text;
        location.reload();
    }
    else{
        alert("Por favor ingrese los datos de acceso");       
    }

 }

//Muestra form login modal
 function showLogin(){
    $("#id01").css("display", "block");
}


//carga perfil de cliente al iniciar la pagina
function load(){
    
    //$("#lilogin").css("display", "none");
    //$("#liorden").css("display", "block");
    console.log(sessionStorage.tokenUser);
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

}






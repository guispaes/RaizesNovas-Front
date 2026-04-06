if (!sessionStorage.getItem('admin_logado')) {
    alert("Acesso negado. Por favor, faça login.");
    window.location.replace("login.html");
}

function fazerLogout() {
    sessionStorage.removeItem('admin_logado');
    // Limpamos a variável correta agora
    sessionStorage.removeItem('admin_usuario'); 
    window.location.replace("login.html");
}
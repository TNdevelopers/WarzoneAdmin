function getUserFunction(data) {
    fetch('http://tndevelopersbackend.000webhostapp.com/warzone/adminuser.php',{
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(responseJson => {
        global.users = responseJson;
        data(responseJson)
    })
    .catch(error => console.log(error))
}

export default getUserFunction;
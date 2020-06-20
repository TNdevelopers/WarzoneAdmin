function getUserFunction() {
    fetch('http://tndevelopersbackend.000webhostapp.com/warzone/transactiondetails.php',{
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(responseJson => {
        global.transaction = responseJson;

        var amount = responseJson.filter(x => x.status === 'COMPLETED')
        var total = 0;
        for(var i=0;i<amount.length;i++) {
            total += parseInt(responseJson[i].amount);
        }
        global.total = total
    })
    .catch(error => console.log(error))
}

export default getUserFunction;
    function calculer(operation) {
        // 1. Récupérer les valeurs des champs grâce à leur id et les convertir en nombres
        var a = parseInt(document.getElementById("nb1").value);
        var b = parseInt(document.getElementById("nb2").value);
        var res = 0;

        // 2. Effectuer l'opération selon le bouton cliqué
        if (operation == '+') {
            res = a + b;
        } else if (operation == '-') {
            res = a - b;
        } else if (operation == '*') {
            res = a * b;
        } else if (operation == '/') {
            res = a / b;
        }

        // 3. Afficher le résultat dans le 3e champ
        document.getElementById("resultat").value = res;
    }
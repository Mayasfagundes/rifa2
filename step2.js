document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const maxNumbers = parseInt(params.get("n"), 10) ; // Quantidade solicitada ou valor padrão
    const selectedNumbers = new Set();
    const totalNumbers = 500; // Total de números na rifa

    const numberGrid = document.getElementById("number-grid");
    const submitButton = document.getElementById("submit-button");

    // Gera os números disponíveis
    for (let i = 1; i <= totalNumbers; i++) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number");
        numberDiv.textContent = i;

        numberDiv.addEventListener("click", () => {
            if (selectedNumbers.size >= maxNumbers && !numberDiv.classList.contains("selected")) {
                alert(`Você só pode escolher até ${maxNumbers} números.`);
                return;
            }

            if (numberDiv.classList.contains("selected")) {
                selectedNumbers.delete(numberDiv.textContent);
                numberDiv.classList.remove("selected");
            } else {
                selectedNumbers.add(numberDiv.textContent);
                numberDiv.classList.add("selected");
            }

            submitButton.disabled = selectedNumbers.size !== maxNumbers;
        });

        numberGrid.appendChild(numberDiv);
    }

    // Envio de dados
    document.getElementById("user-info-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const instagram = document.getElementById("instagram").value.trim();

        // Validação do formulário
        if (!name || !phone || !instagram) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (selectedNumbers.size !== maxNumbers) {
            alert(`Por favor, selecione exatamente ${maxNumbers} números.`);
            return;
        }

        const userData = {
            name,
            phone,
            instagram,
            selectedNumbers: Array.from(selectedNumbers), // Garante um array de strings
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbzFc6ROkAsz474rEs4rpVDXpTklsstjr48VDFB1TbKsM9ZTMFOXcLASMD5f2kck-3yM/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // O tipo de conteúdo precisa corresponder ao esperado pelo Apps Script
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar: HTTP ${response.status}`);
            }

            const result = await response.text(); // O Apps Script retorna texto, não JSON
            alert("Seus dados foram salvos com sucesso!");
            console.log("Resultado:", result);

            // Limpa os dados do formulário e números selecionados
            document.getElementById("user-info-form").reset();
            selectedNumbers.clear();
            document.querySelectorAll(".number.selected").forEach((el) => el.classList.remove("selected"));

            // Redireciona para a página de agradecimento
            window.location.href = "agradecimento.html"; // Alterar para a página de confirmação
        } catch (error) {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados. Por favor, tente novamente.");
        }
    });

    function doGet(e) {
        return ContentService.createTextOutput("")
            .setMimeType(ContentService.MimeType.JSON)
            .setHeader("Access-Control-Allow-Origin", "*")
            .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
            .setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    
});

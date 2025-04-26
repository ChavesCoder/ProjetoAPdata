const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];

const data = {
    labels: labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [10, 50, 30, 70, 20, 60, 40],  // Substitui o Utils.numbers
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: [5, 40, 20, 90, -25, -45, 30],  // Substitui o Utils.numbers
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
            label: 'Dataset 3',
            data: [2, 20, 10, 40, 50, 90, 10],  // Substitui o Utils.numbers
            borderColor: 'rgba(225, 199, 032)',
            backgroundColor: 'rgba(225, 199, 032, 0.5)',
        },
        {
            label: 'Dataset 4',
            data: [10, 50, 10, 20, 65, 75, 20],  // Substitui o Utils.numbers
            borderColor: 'rgb(24, 062, 135)',
            backgroundColor: 'rgb(24, 062, 135, 0.5)',
        }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Valorização dos ultimos 6 meses',
            }
        }
    }
};

new Chart(
    document.getElementById('meuGrafico'),
    config
);

const data2 = {
    labels: ['Domicílio Próprio', 'Outros'],
    datasets: [{
        data: [58, 42],
        backgroundColor: ['#2896df', '#09629d'],
        borderWidth: 1
    }]
};

const config2 = {
    type: 'doughnut',
    data: data2,
    options: {
        cutout: '60%',
        plugins: {
            legend: {
                display: true,  // ATIVA a legenda
                position: 'bottom' // você pode mudar para 'top' ou 'right' se preferir
            },
            title: {
                display: true,
                text: '% de habitantes com domicílio próprio',
            },
            tooltip: {
                enabled: true // ATIVA o tooltip ao passar o mouse
            },
        }
    }
};

new Chart(
    document.getElementById('donutChart2'),
    config2
);
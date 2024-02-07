import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);

export default function EventDoughnut({options}){

    const colors = [
        'rgb(56 189 248)',
        'rgb(250 204 21)',
        'rgb(74 222 128)',
        'rgb(248 113 113)',
        'rgb(167 139 250)',
        // 'rgb(56 189 248)',
        // 'rgb(232 121 249)',
        // 'rgb(251 146 60)',
        // 'rgb(251 191 36)',
        // 'rgb(163 230 53)',
        // 'rgb(74 222 128)',
        // 'rgb(52 211 153)',
        // 'rgb(45 212 191)',
        // 'rgb(34 211 238)',
        // 'rgb(56 189 248)',
        // 'rgb(96 165 250)',
        // 'rgb(129 140 248)',
        // 'rgb(167 139 250)',
        // 'rgb(192 132 252)',
        // 'rgb(232 121 249)',
        // 'rgb(244 114 182)',
        // 'rgb(251 113 133)',
    ];

    const sortedOptions = options.slice().sort((a, b) => b.amount - a.amount);

    const top5Elements = sortedOptions.slice(0, 5);

    const optionsValues = top5Elements.map(element => {
        return element.amount;
    });

    const dataChart = {
        datasets: [
            {
                data: optionsValues,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            },
        ],
    };

    return (
        <>
            <h3 className="text-xl font-bold">Top options</h3>
            <div className="p-5">
                <Doughnut
                    data={dataChart}
                />
            </div>
            {top5Elements.map((option, index) => {
                return <div className="flex items-center p-1 pl-0" key={index}>
                    <div className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: colors[index]}}></div>
                    <p>{option.name}</p>
                </div>
            })}
        </>
    );
}
const series = document.getElementById("series");
const parallel = document.getElementById("parallel");

const cellVoltage = document.getElementById("cellVoltage");
const cellCapacity = document.getElementById("cellCapacity");
const cellCurrent = document.getElementById("cellCurrent");

const chemistry = document.getElementById("chemistry");

const loadVoltage = document.getElementById("loadVoltage");
const loadCurrent = document.getElementById("loadCurrent");

chemistry.addEventListener("change", () => {

    switch(chemistry.value){

        case "18650-2200":
            cellVoltage.value = 3.7;
            cellCapacity.value = 2.2;
            cellCurrent.value = 5;
            break;

        case "18650-2600":
            cellVoltage.value = 3.7;
            cellCapacity.value = 2.6;
            cellCurrent.value = 8;
            break;

        case "18650-3000":
            cellVoltage.value = 3.7;
            cellCapacity.value = 3.0;
            cellCurrent.value = 10;
            break;

        case "18650-3500":
            cellVoltage.value = 3.7;
            cellCapacity.value = 3.5;
            cellCurrent.value = 10;
            break;

        case "21700-4000":
            cellVoltage.value = 3.7;
            cellCapacity.value = 4.0;
            cellCurrent.value = 15;
            break;

        case "21700-5000":
            cellVoltage.value = 3.7;
            cellCapacity.value = 5.0;
            cellCurrent.value = 20;
            break;

        case "lifepo4-32700":
            cellVoltage.value = 3.2;
            cellCapacity.value = 6.0;
            cellCurrent.value = 10;
            break;

        case "lifepo4-32700-7000":
            cellVoltage.value = 3.2;
            cellCapacity.value = 7.0;
            cellCurrent.value = 15;
            break;

        case "aa-alkaline":
            cellVoltage.value = 1.5;
            cellCapacity.value = 3.0;
            cellCurrent.value = 2;
            break;

        case "aa-nimh":
            cellVoltage.value = 1.2;
            cellCapacity.value = 2.5;
            cellCurrent.value = 5;
            break;

        case "polymer-5000":
            cellVoltage.value = 3.7;
            cellCapacity.value = 5.0;
            cellCurrent.value = 10;
            break;

        case "polymer-10000":
            cellVoltage.value = 3.7;
            cellCapacity.value = 10.0;
            cellCurrent.value = 20;
            break;
    }

    updatePack();
});

function recommendBMS(maxCurrent){

    if(maxCurrent <= 10) return "10A";

    if(maxCurrent <= 20) return "20A";

    if(maxCurrent <= 30) return "30A";

    if(maxCurrent <= 50) return "50A";

    if(maxCurrent <= 80) return "80A";

    return "100A+";
}

function chargerVoltageCalc(seriesCount){

    if(
        chemistry.value.includes("lifepo4")
    ){

        return (
            seriesCount * 3.65
        ).toFixed(2);
    }

    return (
        seriesCount * 4.2
    ).toFixed(2);
}

function updatePack(){

    const s = Number(series.value);
    const p = Number(parallel.value);

    const voltagePerCell = Number(cellVoltage.value);
    const capacityPerCell = Number(cellCapacity.value);
    const currentPerCell = Number(cellCurrent.value);

    const lv = Number(loadVoltage.value);
    const lc = Number(loadCurrent.value);

    document.getElementById("seriesValue").textContent = s;
    document.getElementById("parallelValue").textContent = p;

    const totalCells = s * p;

    const packVoltage = s * voltagePerCell;

    const packCapacity = p * capacityPerCell;

    const energy = packVoltage * packCapacity;

    const maxCurrent = p * currentPerCell;

    const loadPower = lv * lc;

    const runtime =
        loadPower > 0
        ? energy / loadPower
        : 0;

    document.getElementById("configuration").textContent =
        `${s}S${p}P`;

    document.getElementById("totalCells").textContent =
        totalCells;

    document.getElementById("voltage").textContent =
        packVoltage.toFixed(2) + " V";

    document.getElementById("capacity").textContent =
        packCapacity.toFixed(2) + " Ah";

    document.getElementById("energy").textContent =
        energy.toFixed(2) + " Wh";

    document.getElementById("maxCurrent").textContent =
        maxCurrent.toFixed(2) + " A";

    document.getElementById("loadPower").textContent =
        loadPower.toFixed(2) + " W";

    document.getElementById("runtime").textContent =
        runtime.toFixed(2) + " h";

    document.getElementById("bms").textContent =
        `${s}S ${recommendBMS(maxCurrent)}`;

    document.getElementById("chargerVoltage").textContent =
        chargerVoltageCalc(s) + " V";

    const status = document.getElementById("status");

    if(lc > maxCurrent){

        status.textContent =
            "⚠ Load exceeds battery current capability";
    }
    else{

        status.textContent =
            "✓ Battery configuration valid";
    }

    drawBatteryLayout(s,p);
    drawNickelLayout(s,p);
}

function drawBatteryLayout(s,p){

    const grid =
        document.getElementById("batteryGrid");

    const svg =
        document.getElementById("batteryConnections");

    grid.innerHTML = "";
    svg.innerHTML = "";

    grid.style.gridTemplateColumns =
        `repeat(${s}, 40px)`;

    let positions = [];

    for(let row=0; row<p; row++){

        positions[row] = [];

        for(let col=0; col<s; col++){

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            const positive =
                col % 2 === 0;

            if(positive){

                cell.classList.add("positive");
                cell.innerHTML = "+";
            }
            else{

                cell.classList.add("negative");
                cell.innerHTML = "-";
            }

            grid.appendChild(cell);

            positions[row][col] = {
                x:(col*52)+20,
                y:(row*52)+20
            };
        }
    }

    const width =
        s * 52;

    const height =
        p * 52;

    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

    svg.setAttribute(
        "width",
        width
    );

    svg.setAttribute(
        "height",
        height
    );

    for(let row=0; row<p; row++){

        for(let col=0; col<s-1; col++){

            const p1 =
                positions[row][col];

            const p2 =
                positions[row][col+1];

            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

            line.setAttribute(
                "x1",
                p1.x
            );

            line.setAttribute(
                "y1",
                p1.y
            );

            line.setAttribute(
                "x2",
                p2.x
            );

            line.setAttribute(
                "y2",
                p2.y
            );

            line.setAttribute(
                "stroke",
                "#FFD54F"
            );

            line.setAttribute(
                "stroke-width",
                "3"
            );

            svg.appendChild(line);
        }
    }

    for(let col=0; col<s; col++){

        for(let row=0; row<p-1; row++){

            const p1 =
                positions[row][col];

            const p2 =
                positions[row+1][col];

            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

            line.setAttribute(
                "x1",
                p1.x
            );

            line.setAttribute(
                "y1",
                p1.y
            );

            line.setAttribute(
                "x2",
                p2.x
            );

            line.setAttribute(
                "y2",
                p2.y
            );

            line.setAttribute(
                "stroke",
                "#42A5F5"
            );

            line.setAttribute(
                "stroke-width",
                "2"
            );

            svg.appendChild(line);
        }
    }
}

function drawNickelLayout(series,parallel){

    let html = "";

    for(let row = 0; row < parallel; row++){

        for(let col = 0; col < series; col++){

            html += `
            <span style="
                color:#FFD54F;
                font-size:24px;
                font-weight:bold;
            ">●</span>`;

            if(col < series - 1){

                html += `
                <span style="
                    color:#FFD54F;
                    font-size:24px;
                ">═══</span>`;
            }
        }

        html += "<br><br>";
    }

    document.getElementById(
        "nickelLayout"
    ).innerHTML = html;
}


[
series,
parallel,
cellVoltage,
cellCapacity,
cellCurrent,
loadVoltage,
loadCurrent
].forEach(el => {

    el.addEventListener("input", updatePack);
});

updatePack();
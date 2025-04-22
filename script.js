document.addEventListener('DOMContentLoaded', function() {
    initializeCalculators();
});


function initializeCalculators() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.getAttribute('data-tab')));
    });

    setupCalculator1();
    
    setupCalculator2();
}

/**
 * @param {string} tabId 
 */
function switchTab(tabId) {
    const calculators = document.querySelectorAll('.calculator');
    calculators.forEach(calc => calc.classList.remove('active-calculator'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-calculator');
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}


function setupCalculator1() {

    const inputs = ['hp', 'cp', 'sp', 'np', 'op', 'wp', 'ap'].map(id => document.getElementById(id));
    const calculateBtn = document.getElementById('calculate1-btn');
    const resetBtn = document.getElementById('reset1-btn');
    const sumElement = document.getElementById('sum1');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => updateSum(inputs, sumElement));
    });
    
    calculateBtn.addEventListener('click', () => calculate1(inputs));
    
    resetBtn.addEventListener('click', () => {
        inputs.forEach(input => input.value = '');
        document.getElementById('results1').style.display = 'none';
        document.getElementById('error1').style.display = 'none';
        updateSum(inputs, sumElement);
    });
}

function setupCalculator2() {
    const combustibleInputs = ['cg2', 'hg2', 'og2', 'sg2'].map(id => document.getElementById(id));
    const allInputs = [...combustibleInputs, 'qdaf', 'wr2', 'ad2', 'v2'].map(id => typeof id === 'string' ? document.getElementById(id) : id);
    const calculateBtn = document.getElementById('calculate2-btn');
    const resetBtn = document.getElementById('reset2-btn');
    const sumElement = document.getElementById('sum2');
    
    combustibleInputs.forEach(input => {
        input.addEventListener('input', () => updateSum(combustibleInputs, sumElement));
    });
    
    calculateBtn.addEventListener('click', () => calculate2());

    resetBtn.addEventListener('click', () => {
        allInputs.forEach(input => input.value = '');
        document.getElementById('results2').style.display = 'none';
        document.getElementById('error2').style.display = 'none';
        updateSum(combustibleInputs, sumElement);
    });
}

/**
 * @param {Array} inputs 
 * @param {Element} sumElement 
 */
function updateSum(inputs, sumElement) {
    const sum = inputs.reduce((total, input) => {
        const value = parseFloat(input.value) || 0;
        return total + value;
    }, 0);
    
    sumElement.textContent = sum.toFixed(1) + '%';
    
    if (Math.abs(sum - 100) < 0.1) {
        sumElement.style.color = '#2ecc71'; 
    } else {
        sumElement.style.color = '#e74c3c'; 
    }
}

/**
 * @param {Array} inputs 
 */
function calculate1(inputs) {
    const values = {};
    inputs.forEach(input => {
        values[input.id] = parseFloat(input.value) || 0;
    });
    
    const { hp, cp, sp, np, op, wp, ap } = values;
    
    if (!validateInputs(inputs)) {
        showError('error1', 'Будь ласка, заповніть усі поля');
        hideResults('results1');
        return;
    }
    
    const total = hp + cp + sp + np + op + wp + ap;
    if (Math.abs(total - 100) > 0.1) {
        showError('error1', `Сума всіх компонентів повинна дорівнювати 100% (поточна сума: ${total.toFixed(1)}%)`);
        hideResults('results1');
        return;
    }
    
    hideError('error1');
    

    const kpc = 100 / (100 - wp);
    const kpg = 100 / (100 - wp - ap);
    
    const hc = hp * kpc;
    const cc = cp * kpc;
    const sc = sp * kpc;
    const nc = np * kpc;
    const oc = op * kpc;
    const ac = ap * kpc;

    const hg = hp * kpg;
    const cg = cp * kpg;
    const sg = sp * kpg;
    const ng = np * kpg;
    const og = op * kpg;
    
    const qpn = 339 * cp + 1030 * hp - 108.8 * (op - sp) - 25 * wp;
    const qdn = qpn * 100 / (100 - wp);
    const qdafn = qpn * 100 / (100 - wp - ap);
    
    document.getElementById('kpc').textContent = kpc.toFixed(2);
    document.getElementById('kpg').textContent = kpg.toFixed(2);
    
    document.getElementById('dryMass').innerHTML = `
        <div class="result-item">
            <span class="result-label">H<sup>C</sup>:</span>
            <span class="result-value">${hc.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">C<sup>C</sup>:</span>
            <span class="result-value">${cc.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">S<sup>C</sup>:</span>
            <span class="result-value">${sc.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">N<sup>C</sup>:</span>
            <span class="result-value">${nc.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">O<sup>C</sup>:</span>
            <span class="result-value">${oc.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">A<sup>C</sup>:</span>
            <span class="result-value">${ac.toFixed(2)}%</span>
        </div>
    `;
    
    document.getElementById('combustibleMass').innerHTML = `
        <div class="result-item">
            <span class="result-label">H<sup>Г</sup>:</span>
            <span class="result-value">${hg.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">C<sup>Г</sup>:</span>
            <span class="result-value">${cg.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">S<sup>Г</sup>:</span>
            <span class="result-value">${sg.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">N<sup>Г</sup>:</span>
            <span class="result-value">${ng.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">O<sup>Г</sup>:</span>
            <span class="result-value">${og.toFixed(2)}%</span>
        </div>
    `;
    
    document.getElementById('heatingValue').innerHTML = `
        <div class="result-item">
            <span class="result-label">Q<sup>P</sup><sub>H</sub>:</span>
            <span class="result-value">${(qpn/1000).toFixed(2)} МДж/кг</span>
        </div>
        <div class="result-item">
            <span class="result-label">Q<sup>C</sup><sub>H</sub>:</span>
            <span class="result-value">${(qdn/1000).toFixed(2)} МДж/кг</span>
        </div>
        <div class="result-item">
            <span class="result-label">Q<sup>Г</sup><sub>H</sub>:</span>
            <span class="result-value">${(qdafn/1000).toFixed(2)} МДж/кг</span>
        </div>
    `;
    
    document.getElementById('results1').style.display = 'block';
    
    document.getElementById('results1').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculate2() {
    const cg = parseFloat(document.getElementById('cg2').value);
    const hg = parseFloat(document.getElementById('hg2').value);
    const og = parseFloat(document.getElementById('og2').value);
    const sg = parseFloat(document.getElementById('sg2').value);
    const qdaf = parseFloat(document.getElementById('qdaf').value);
    const wr = parseFloat(document.getElementById('wr2').value);
    const ad = parseFloat(document.getElementById('ad2').value);
    const v = parseFloat(document.getElementById('v2').value);
    
    const inputs = [
        { id: 'cg2', value: cg },
        { id: 'hg2', value: hg },
        { id: 'og2', value: og },
        { id: 'sg2', value: sg },
        { id: 'qdaf', value: qdaf },
        { id: 'wr2', value: wr },
        { id: 'ad2', value: ad },
        { id: 'v2', value: v }
    ];
    
    if (!validateInputs(inputs)) {
        showError('error2', 'Будь ласка, заповніть усі поля');
        hideResults('results2');
        return;
    }
    
    const total = cg + hg + og + sg;
    if (Math.abs(total - 100) > 0.1) {
        showError('error2', `Сума компонентів горючої маси повинна дорівнювати 100% (поточна сума: ${total.toFixed(1)}%)`);
        hideResults('results2');
        return;
    }

    hideError('error2');
    
    const k = (100 - wr - ad) / 100;
    
    const cr = cg * k;
    const hr = hg * k;
    const or = og * k;
    const sr = sg * k;
    const ar = ad * (100 - wr) / 100;
    const vr = v * (100 - wr) / 100;
    
    const qr = qdaf * (100 - wr - ar) / 100;
    
    document.getElementById('workingMass').innerHTML = `
        <div class="result-item">
            <span class="result-label">C<sup>P</sup>:</span>
            <span class="result-value">${cr.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">H<sup>P</sup>:</span>
            <span class="result-value">${hr.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">O<sup>P</sup>:</span>
            <span class="result-value">${or.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">S<sup>P</sup>:</span>
            <span class="result-value">${sr.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">A<sup>P</sup>:</span>
            <span class="result-value">${ar.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">W<sup>P</sup>:</span>
            <span class="result-value">${wr.toFixed(2)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">V<sup>P</sup>:</span>
            <span class="result-value">${vr.toFixed(2)} мг/кг</span>
        </div>
    `;
    
    document.getElementById('heatingValue2').innerHTML = `
        <div class="result-item">
            <span class="result-label">Q<sup>P</sup><sub>H</sub>:</span>
            <span class="result-value">${qr.toFixed(2)} МДж/кг</span>
        </div>
    `;
    
    document.getElementById('results2').style.display = 'block';
    
    document.getElementById('results2').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * @param {Array} inputs 
 * @returns {boolean} 
 */
function validateInputs(inputs) {
    return inputs.every(input => {
        const value = typeof input === 'object' ? input.value : parseFloat(document.getElementById(input).value);
        return !isNaN(value);
    });
}

/**
 * @param {string} errorId 
 * @param {string} message 
 */
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * @param {string} errorId 
 */
function hideError(errorId) {
    document.getElementById(errorId).style.display = 'none';
}

/**
 * @param {string} resultsId 
 */
function hideResults(resultsId) {
    document.getElementById(resultsId).style.display = 'none';
}
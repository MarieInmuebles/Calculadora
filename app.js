// Esperar a DOM listo
document.addEventListener('DOMContentLoaded', ()=>{
  const elems = {
    totalAmount:  document.getElementById('totalAmount'),
    monthlyExpenses: document.getElementById('monthlyExpenses'),
    profitDisplay: document.getElementById('profitDisplay'),
    cost: document.getElementById('cost'),
    price: document.getElementById('price'),
    salary: document.getElementById('salary'),
    operationsPerMonth: document.getElementById('operationsPerMonth'),
    operationsLabel: document.getElementById('operationsLabel'),
    expenseStatus: document.getElementById('expenseStatus'),
    monthlyProfit: document.getElementById('monthlyProfit'),
    monthsNeeded: document.getElementById('monthsNeeded'),
    yearsNeeded: document.getElementById('yearsNeeded'),
    expensesContainer: document.getElementById('expensesContainer'),
    addCustomExpenseBtn: document.getElementById('addCustomExpense'),
    rent: document.getElementById('rent'),
    food: document.getElementById('food'),
    services: document.getElementById('services'),
    entertainment: document.getElementById('entertainment'),
    darkToggle: document.querySelector('.dark-mode-toggle')
  };

  let expenses = { rent:0, food:0, services:0, entertainment:0 };
  let chartInstance = null;

  const updateAll = ()=>{
    updateExpenses(); updateProfit(); updateResults(); updateChart(); saveState();
  };

  function updateExpenses() {
    let sum = Object.values(expenses).reduce((a,b)=>a+(+b||0),0);
    let custom=0;
    document.querySelectorAll('.custom-expense .expense-amount')
      .forEach(i=>custom+=parseFloat(i.value)||0);
    elems.monthlyExpenses.value=(sum+custom).toFixed(2);
  }

  function updateProfit() {
    const p = (+elems.price.value||0)-(+elems.cost.value||0);
    elems.profitDisplay.textContent = p.toFixed(2)+'$';
    elems.profitDisplay.classList.add('pulse');
    setTimeout(()=>elems.profitDisplay.classList.remove('pulse'),300);
  }

  function updateResults() {
    const total=+elems.totalAmount.value||0;
    const expensesM=+elems.monthlyExpenses.value||0;
    const ops=+elems.operationsPerMonth.value;
    const profit=+elems.profitDisplay.textContent.replace('$','')||0;
    const salary=+elems.salary.value||0;
    const monthlyProfit=(profit*ops)+salary-expensesM;
    elems.monthlyProfit.textContent=monthlyProfit.toFixed(2);

    if(monthlyProfit>0){
      const months=Math.ceil(total/monthlyProfit);
      elems.monthsNeeded.textContent=months;
      elems.yearsNeeded.textContent=(months/12).toFixed(2);
      elems.expenseStatus.textContent='✅ Suficiente';
      elems.expenseStatus.className='sufficient';
    } else {
      elems.monthsNeeded.textContent='0';
      elems.yearsNeeded.textContent='0';
      elems.expenseStatus.textContent='❌ Insuficiente';
      elems.expenseStatus.className='insufficient';
    }
  }

  function updateChart(){
    const ctx = document.getElementById('expensesChart').getContext('2d');
    let vals = {
      'Alquiler':+elems.rent.value||0,
      'Comida':+elems.food.value||0,
      'Servicios':+elems.services.value||0,
      'Entretenimiento':+elems.entertainment.value||0
    };
    document.querySelectorAll('.custom-expense').forEach(div=>{
      const name=div.querySelector('.expense-name').value||'Personal';
      const amt=+div.querySelector('.expense-amount').value||0;
      vals[name]=(vals[name]||0)+amt;
    });
    const labels=Object.keys(vals).filter(k=>vals[k]>0);
    const data=labels.map(k=>vals[k]);
    const total=data.reduce((a,b)=>a+b,0);
    if(chartInstance) chartInstance.destroy();
    if(total===0){
      document.getElementById('expensesChart').style.display='none';
      document.getElementById('chartLegend').innerHTML='';
      return;
    }
    document.getElementById('expensesChart').style.display='block';
    chartInstance = new Chart(ctx,{...});
  }

  function saveState(){ /* similar a lo anterior */ }
  function loadState(){ /* similar a lo anterior */ }
  function createCustom(name='',amount='0'){ /* similar a lo anterior */ }

  // Listeners y init
  ['totalAmount','salary','cost','price'].forEach(id=>document.getElementById(id).addEventListener('input',updateAll));
  Object.keys(expenses).forEach(k=>document.getElementById(k).addEventListener('input',e=>{expenses[k]=e.target.value;updateAll();}));
  elems.operationsPerMonth.addEventListener('input',()=>{ elems.operationsLabel.textContent=elems.operationsPerMonth.value; updateAll(); });
  elems.addCustomExpenseBtn.addEventListener('click',()=>{ createCustom(); updateAll(); });
  elems.darkToggle.addEventListener('click',()=>{ document.body.classList.toggle('dark-mode'); elems.darkToggle.textContent=document.body.classList.contains('dark-mode')?'🌙':'☀️'; saveState(); });

  loadState(); setTimeout(updateAll,100);
});
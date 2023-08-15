import { useEffect, useState } from 'react';
import './App.css';
import transaction from './api/models/Transaction';

function App() 
{
   {/* For all the inputs we need to add states to have the values inside our ReactApp */}
    const[name,setName]=useState('');
    const[datetime,setDatetime]=useState('');
    const[description,setDescription]=useState('');
    //We need to save our tranactions into state
    const [transactions,setTransactions]=useState([]);

    // Function to fetch transactions from the server
    const fetchTransactions = () => 
    {
      const url = process.env.REACT_APP_API_URL + '/transactions'; 
        fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((json) => {
          // Update the state with the fetched transactions
          setTransactions(json);
        })
        .catch((error) => {
          console.error('Error occurred:', error);
        });
    };
      // useEffect to fetch transactions on mount and set up a 2-second refresh
      useEffect(() => 
      {
        fetchTransactions(); // Fetch transactions on mount

        const intervalId = setInterval(() => {
          fetchTransactions(); // Fetch transactions every 2 seconds
        }, 2000);

        return () => {
          clearInterval(intervalId); // Clean up the interval when the component unmounts
        };
      }, []); // Empty dependency array ensures the effect runs only once on mount



    //When our app runs we want to run something so that it fetches all or transactions so we use useEffect
    useEffect(()=>{
      getTransactions().then(setTransactions)
    },[]);

    async function getTransactions()
    {
      const url=process.env.REACT_APP_API_URL+'/transactions';
      const response = await fetch(url);
      return await response.json();
    }

    function addNewTransaction(ev){
      ev.preventDefault();
      const url=process.env.REACT_APP_API_URL+'/transaction';
      const price=name.split(' ')[0];//Getting the price first since it is before the space
      //console.log(url);
      fetch(url,{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({
          price,
          name:name.substring(price.length+1),/*So that the name starts after the price has been extracted*/
          description,
          datetime,
          })
      }).then(response=>{
        response.json().then(json=>{
          //After submitting the form we want to set everything to empty
          setName('');
          setDatetime('');
          setDescription('');
          console.log('result',json);
        });
      })
    }  

    let balance=0;
    //for each loop for transactions
    for (const transaction of transactions)
    {
      balance=balance+transaction.price;
    }

    balance=balance.toFixed(2);
    //Getting the cents
    const cents=balance.split('.')[1];
    balance=balance.split('.')[0];
    return (
    <main>
      {/* This is the balance */}
      <h1>R{balance}<span>.{cents}</span></h1>

      {/* There will be 3 inputs in the form for name, date-time, and descriptions */}
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
            <input  type="text" 
                    value={name}
                    onChange={ev=> setName(ev.target.value)}
                    placeholder='-300 Iphone X' />
            <input  type="datetime-local"  
                    value={datetime}
                    onChange={ev=> setDatetime(ev.target.value)}
            />
        </div>
        <div className='description'>
         <input  type="text"
                  value={description}
                  onChange={ev=> setDescription(ev.target.value)}
                 placeholder='Transaction Description'/>
        </div>
         {/* The button will submit our form when we click on it */}  
        <button type='submit'>Add New Transaction</button>
        
     </form>

     <div className='transactions'>
      {/*First need to check if there are any transactions */ }
      {transactions.length>0 && transactions.map(transaction =>(
         <div className='transaction'>
         <div className='left'>
           <div className='name'>{transaction.name}</div>
           <div className='description'>{transaction.description}</div>
         </div>
 
         <div className='right'>
            {console.log(transaction.price)}
           <div className={'price '+(transaction.price<0?'red':'green')}>
            {transaction.price}</div>
           <div className='datetime'>{transaction.datetime}</div>
         </div>
       </div>
      ))}
     

     </div>

    </main>
  );
}

export default App;

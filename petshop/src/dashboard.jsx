// import React, { useState, useEffect } from 'react';
// import './style/dashboard.css';
import './style/dashboard.css';

function Dashboard() {

  //exemplo para test de intervalos:
  const intervals = [
    { nome: 'banho na lola', start: 8, end: 9 },
    { nome: 'tosa na belinha', start: 2, end: 4 },
    { nome: 'banho na jujuba', start: 5, end: 7 },
    { nome: 'banho no jeck', start: 1, end: 3 },
    { nome: 'banho na lara', start: 3, end: 6 },
    { nome: 'tosa e banho no lulu', start: 1, end: 10 },
    { nome: 'tosa no paçoca', start: 17, end: 20 },
    { nome: 'tosa no Duke', start: 15, end: 18 },
    { nome: 'banho no lucy', start: 10, end: 13 },
    { nome: 'tosa no max', start: 13, end: 16 },
  ];

  function swap(x, y, heap){
    let heapSwap = heap;
    const temp = heapSwap[x];
    heapSwap[x] = heapSwap[y];
    heapSwap[y] = temp;
    return heapSwap;
  }
  
  function shiftUp(indice, heap){
    let ind = indice;
    let cont = (heap.length-1);
    let indPaiAtual = parseInt((ind -1) / 2); 
    let PaiAtual = heap[indPaiAtual].end; 
    let atual = heap[ind].end;
  
    if (atual < PaiAtual) { 
      cont--;
      heap = swap(ind, indPaiAtual, heap);
      ind = indPaiAtual;
      shiftUp(ind, heap);
    }
  }
  
  function pegaMenor(heap){
    let menor = 0;
    let ultimo = heap.length-1;
  
    heap = swap(0, ultimo, heap);
    menor = heap.pop();
    return menor;
  }
  
  function heapify(indice, heap) {
    const indEsq = parseInt(2 * indice + 1); // indice do filho do atual que esta na esquerda
    const indDir = parseInt(2 * indice + 2); // indice do filho do atual que esta na direita
    let numMenor = indice;
  
    if ( heap[indEsq] != undefined && heap[indDir] != undefined) {
      
      if (heap[indEsq].end < heap[numMenor].end) {
        numMenor = indEsq;
      }
  
      if (heap[indDir].end < heap[numMenor].end) {
        numMenor = indDir;
      }
  
      if (numMenor !== indice) {
        heap = swap(indice, numMenor, heap);
        heapify(numMenor, heap);
      }
    }
  }
  
  const heap = [];
  
  function intervalScheduling(intervals) {
   
    const intervaloCompativel = [];
    const heapResultado = [];
    let tempoFinalMenor = 0; 
   
    for (const intervalo of intervals) {
      heap.push(intervalo);
      shiftUp(heap.length - 1, heap);
    }
    
    while (heap.length > 0) {
      tempoFinalMenor = pegaMenor(heap);
      heapResultado.push(tempoFinalMenor);
      heapify(0, heap);
    }
  
    let intervalOrdenado = heapResultado[0];
    intervaloCompativel.push(intervalOrdenado);
    
    for (let i = 1; i < heapResultado.length; i++) {
        const inter = heapResultado[i];
        // Verifica se o intervalo da tarefa atual é compativel com os que ja estao no array intervalOrdenado
        if (inter.start >= intervalOrdenado.end) {
            intervaloCompativel.push(inter);
            intervalOrdenado = inter;
        }
    }
    return intervaloCompativel;
  }
  
  const resultado = intervalScheduling(intervals);
  console.log(resultado);


  return (
    <div className='pagina'>
      <div>
        <h1>hello world</h1>
      </div>
    </div>
  );
}

export default Dashboard;

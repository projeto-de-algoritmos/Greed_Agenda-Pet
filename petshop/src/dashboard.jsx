import React, { useState, useEffect } from 'react';
import './style/dashboard.css';

function Dashboard() {
  const [petName, setPetName] = useState('');
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:30");
  const [intervals, setIntervals] = useState([]); 

  function swap(x, y, heap){
    let heapSwap = heap;
    const temp = heapSwap[x];
    heapSwap[x] = heapSwap[y];
    heapSwap[y] = temp;
    return heapSwap;
  }
  
  function shiftUp(indice, heap){
    let ind = indice;
    let indPaiAtual = parseInt((ind - 1) / 2);
    let PaiAtual = heap[indPaiAtual].end;
    let atual = heap[ind].end;

    while (ind > 0 && atual < PaiAtual) {
      heap = swap(ind, indPaiAtual, heap);
      ind = indPaiAtual;
      indPaiAtual = parseInt((ind - 1) / 2);
      PaiAtual = heap[indPaiAtual].end;
      atual = heap[ind].end;
    }
  }
  
  function pegaMenor(heap){
    const menor = heap[0];
    const ultimo = heap.length - 1;
    heap[0] = heap[ultimo];
    heap.pop();
    heapify(0, heap);
    return menor;
  }
  
  function heapify(indice, heap) {
    const indEsq = parseInt(2 * indice + 1); // indice do filho do atual que esta na esquerda
    const indDir = parseInt(2 * indice + 2); // indice do filho do atual que esta na direita
    let numMenor = indice;

    if (indEsq < heap.length && heap[indEsq].end < heap[numMenor].end) {
      numMenor = indEsq;
    }

    if (indDir < heap.length && heap[indDir].end < heap[numMenor].end) {
      numMenor = indDir;
    }

    if (numMenor !== indice) {
      heap = swap(indice, numMenor, heap);
      heapify(numMenor, heap);
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
 
  const handlePetNameChange = (e) => {
    setPetName(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };
  // adicionar intervalo de tempo nas opções
  const addInterval = () => {
    if (petName && startTime && endTime && startTime < endTime) {
      const newInterval = {
        nome: petName,
        start: new Date(`2023-01-01T${startTime}`),
        end: new Date(`2023-01-01T${endTime}`)
      };
      if (!hasConflicts(newInterval, intervals)) {
        setIntervals([...intervals, newInterval]);
        setPetName('');
        setStartTime('08:00');
        setEndTime('08:30');
      } else {
        window.alert('Conflito de Horário: Já existe um agendamento no mesmo horário.');
      }
    }
  };
  // verificar se há conflitos no agendamento
  function hasConflicts(newInterval, intervals) {
    for (const interval of intervals) {
      if (
        (newInterval.start >= interval.start && newInterval.start < interval.end) ||
        (newInterval.end > interval.start && newInterval.end <= interval.end)
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className='pagina'>
      <div>
        <h1>Agenda Pet</h1>
        <div className='options'>

        <div>
          <label htmlFor="petName">Nome da tarefa:</label>
          <input
            placeholder='nome da tarefa e do pet, EX: Banho na lola'
            className='form-field'
            type="text"
            id="petName"
            value={petName}
            onChange={handlePetNameChange}
          />
        </div>
        <div>
          <label htmlFor="startTime">Hora de Início:</label>
          <select
            placeholder='hora de inicio'
            className='form-field'
            id="startTime"
            value={startTime}
            onChange={handleStartTimeChange}
          >
            {generateTimeOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endTime">Hora de Fim:</label>
          <select
            placeholder='hora de fim'
            className='form-field'
            id="endTime"
            value={endTime}
            onChange={handleEndTimeChange}
          >
            {generateTimeOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button className='button-visit' onClick={addInterval}>Adicionar Agendamento</button>
        <div className='result'>
          <h2>Agendamentos:</h2>
          <ol>
            {intervals.map((interval, index) => (
              <li key={index}>
                {interval.nome} - {formatTime(interval.start)} - {formatTime(interval.end)}
              </li>
            ))}
          </ol>
        </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default Dashboard;
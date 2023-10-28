import React, { useState, useEffect } from 'react';
// import './style/dashboard.css';
import './style/dashboard.css';

function Dashboard() {
  const [petName, setPetName] = useState('');
  // const [startTime, setStartTime] = useState(1);
  // const [endTime, setEndTime] = useState(2);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:30");
  const [scheduledAppointments, setScheduledAppointments] = useState([]);

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

  function addAppointment() {
    const startTimeParts = startTime.split(":");
    const endTimeParts = endTime.split(":");

    const startTimeMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
    const endTimeMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);

    if (startTimeMinutes >= endTimeMinutes) {
      alert('Horário de início deve ser menor que o horário de término.');
      return;
    }

    for (const appointment of scheduledAppointments) {
      const appointmentStartTimeParts = appointment.start.split(":");
      const appointmentEndTimeParts = appointment.end.split(":");

      const appointmentStartTimeMinutes = parseInt(appointmentStartTimeParts[0]) * 60 + parseInt(appointmentStartTimeParts[1]);
      const appointmentEndTimeMinutes = parseInt(appointmentEndTimeParts[0]) * 60 + parseInt(appointmentEndTimeParts[1]);

      if (
        (startTimeMinutes >= appointmentStartTimeMinutes && startTimeMinutes < appointmentEndTimeMinutes) ||
        (endTimeMinutes > appointmentStartTimeMinutes && endTimeMinutes <= appointmentEndTimeMinutes)
      ) {
        alert('Conflito de horários com outro agendamento.');
        return;
      }
    }

    const newAppointment = {
      nome: petName,
      start: startTime,
      end: endTime,
    };

    setScheduledAppointments([...scheduledAppointments, newAppointment]);
    setPetName('');
    setStartTime('08:00');
    setEndTime('08:30');
  }

  // Gere as opções de tempo de 30 em 30 minutos.
  const timeOptions = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const formattedTime = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(formattedTime);
    }
  }

  return (
    <div className='pagina'>
      <div>
        <h1>hello world</h1>
        <div>
          <input
            type="text"
            placeholder="Nome do pet"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>)
            )}
          </select>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>)
            )}
          </select>
          <button onClick={addAppointment}>Adicionar Agendamento</button>
        </div>
        <div>
          <h2>Agendamentos:</h2>
          <ul>
            {scheduledAppointments.map((appointment, index) => (
              <li key={index}>
                {appointment.nome} - Início: {appointment.start} - Término: {appointment.end}
              </li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
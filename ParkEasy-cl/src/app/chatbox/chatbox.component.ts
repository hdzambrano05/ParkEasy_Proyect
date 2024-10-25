import { Component } from '@angular/core';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent {
  messages: { from: string; content: string }[] = [];
  newMessage: string = '';
  isChatOpen: boolean = false;
  areQuestionsVisible: boolean = false; // Controla la visibilidad de las preguntas

  // Almacenar las preguntas y respuestas
  predefinedResponses: { question: string; answer: string }[] = [
    { question: "¿Cuál es su horario de atención?", answer: "Nuestro horario de atención es de 8 AM a 8 PM." },
    { question: "¿Cómo puedo hacer una reserva?", answer: "Puede hacer una reserva a través de nuestra página web o llamándonos." },
    { question: "¿Cuánto cuesta el servicio?", answer: "El costo del servicio depende del tipo de vehículo y la duración de la reserva." },
    { question: "¿Aceptan tarjetas de crédito?", answer: "Sí, aceptamos tarjetas de crédito y débito." },
    { question: "¿Dónde se encuentra el parqueadero?", answer: "Estamos ubicados en la Calle 123 #45-67, Bogotá." },
  ];

  constructor() {
    this.initializeChat(); // Inicializar chat con un mensaje de saludo
  }

  initializeChat() {
    this.messages.push({ from: 'Cliente', content: 'Hola' }); // Mensaje inicial del cliente
    this.messages.push({ from: 'Administrador', content: '¡Hola! ¿Cómo puedo ayudarte hoy?' }); // Respuesta inicial del administrador
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen; // Alterna la visibilidad del chat
  }

  toggleQuestions() {
    this.areQuestionsVisible = !this.areQuestionsVisible; // Alterna la visibilidad de las preguntas
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ from: 'Cliente', content: this.newMessage });
      this.getAdminResponse(this.newMessage);
      this.newMessage = '';
    }
  }

  getAdminResponse(message: string) {
    const response = this.findSimilarQuestion(message);
    this.messages.push({ from: 'Administrador', content: response });
  }

  findSimilarQuestion(message: string): string {
    const options = {
      keys: ['question'],
      threshold: 0.4, // Permitir coincidencias más sueltas
    };

    const fuse = new Fuse(this.predefinedResponses, options);
    const result = fuse.search(message); // Buscar coincidencias

    if (result.length > 0) {
      return result[0].item.answer; // Devolver la respuesta de la mejor coincidencia
    }

    return "Lo siento, no tengo una respuesta para esa pregunta."; // Respuesta por defecto
  }

  selectQuestion(question: string) {
    this.newMessage = question; // Rellenar el campo de entrada con la pregunta seleccionada
    this.sendMessage(); // Enviar el mensaje automáticamente
  }
}

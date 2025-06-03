import { Component, AfterViewInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { CalendarEvent, EventDay } from '../models/calendar.model';




@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false,
})

export class Tab2Page implements AfterViewInit {
  today: Date = new Date(); // fecha actual
  activeDay: number = this.today.getDate(); // dia seleccionado
  month: number = this.today.getMonth(); // mes actual 
  year: number = this.today.getFullYear(); // año actual
  months: string[] = [  //lista de los meses
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // array que contiene a los eventos del dia
  //ESTO ES LO QUE ESTÁ ROMPIENDO TODO, LIMPIA EL ARRAY DE EVENTOS CADA VEZ QUE LEVANTA EL COSO.
  eventsArr: EventDay[] = [];


  // Referencias a elementos del DOM
  calendar!: HTMLElement;
  date!: HTMLElement;
  daysContainer!: HTMLElement;
  prev!: HTMLElement;
  next!: HTMLElement;
  todayBtn!: HTMLElement;
  gotoBtn!: HTMLElement;
  dateInput!: HTMLInputElement;
  eventDay!: HTMLElement;
  eventDate!: HTMLElement;
  eventsContainer!: HTMLElement;
  addEventBtn!: HTMLElement;
  addEventWrapper!: HTMLElement;
  addEventCloseBtn!: HTMLElement;
  addEventTitle!: HTMLInputElement;
  addEventFrom!: HTMLInputElement;
  addEventTo!: HTMLInputElement;
  addEventSubmit!: HTMLElement;

  constructor(
    private toastCtrl: ToastController,
    private auth: AuthService,
    private userService: UsersService
  ) { }

  /*ngOnInit es una función especial de Angular que se ejecuta siempre que abrís un componente ANTES
  de renderizar el DOM */

  ngOnInit() {
    this.loadUserProfile();
  }

  ///toast para los alertas
  /**
   *Muestra temporalmente el mensaje ingresado por parametro
   *
   * @param {string} message
   * @memberof LoginPage
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  async loadUserProfile() {
    try {
      // Obtener el usuario autenticado desde Firebase
      const userFirebase = this.auth.getCurrentUser();

      // Obtener los datos desde Firestore directamente
      const user = await this.userService.obtenerPerfilUsuario(userFirebase!.email!);
      //! -> le digo a TS que la variable nunca será null ni undefined, omite comprobacion
      console.log(user!)
      this.eventsArr = user!.events_array
      //console.log("Datos del usuario autenticado: ", userFirebase!.email)
      console.log("Datos del usuario cargados:", user);

      console.log("array eventos: ", this.eventsArr);

      console.log("al final de ngonInit el eventsArray tiene ", this.eventsArr.length, " tareas")
    } catch (error) {

      console.error("Error al obtener los datos del usuario:", error);
      this.showToast("Error al obtener los datos del usuario: " + error);
    }
  }

  ngAfterViewInit() {

    // Inicializa referencias después de que la vista se ha cargado
    this.calendar = document.querySelector(".calendar") as HTMLElement;
    this.date = document.querySelector(".date") as HTMLElement;
    this.daysContainer = document.querySelector(".days") as HTMLElement;
    this.prev = document.querySelector(".prev") as HTMLElement;
    this.next = document.querySelector(".next") as HTMLElement;
    this.todayBtn = document.querySelector(".today-btn") as HTMLElement;
    this.gotoBtn = document.querySelector(".goto-btn") as HTMLElement;
    this.dateInput = document.querySelector(".date-input") as HTMLInputElement;
    this.eventDay = document.querySelector(".event-day") as HTMLElement;
    this.eventDate = document.querySelector(".event-date") as HTMLElement;
    this.eventsContainer = document.querySelector(".events") as HTMLElement;
    this.addEventBtn = document.querySelector(".add-event") as HTMLElement;
    this.addEventWrapper = document.querySelector(".add-event-wrapper") as HTMLElement;
    this.addEventCloseBtn = document.querySelector(".close") as HTMLElement;
    this.addEventTitle = document.querySelector(".event-name") as HTMLInputElement;
    this.addEventFrom = document.querySelector(".event-time-from") as HTMLInputElement;
    this.addEventTo = document.querySelector(".event-time-to") as HTMLInputElement;
    this.addEventSubmit = document.querySelector(".add-event-btn") as HTMLElement;

    // Inicializa el calendario y configura los listeners de eventos
    // listeners serian las funciones que escuchan acciones del usuario
    this.initCalendar();

    // Agrega los eventos de los botones prev/next
    this.prev.addEventListener("click", () => this.prevMonth());
    this.next.addEventListener("click", () => this.nextMonth());
    this.todayBtn.addEventListener("click", () => this.goToday());
    this.gotoBtn.addEventListener("click", () => this.gotoDate());
    this.dateInput.addEventListener("input", (e) => this.onDateInput(e));

    // Agrega evento al botón para añadir un nuevo evento
    this.addEventBtn.addEventListener("click", () => this.addEventWrapper.classList.toggle("active"));
    this.addEventCloseBtn.addEventListener("click", () => this.addEventWrapper.classList.remove("active"));
    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target !== this.addEventBtn && !this.addEventWrapper.contains(target)) {
        this.addEventWrapper.classList.remove("active");
      }
    });

    // Limita el número de caracteres del título del evento
    this.addEventTitle.addEventListener("input", () => {
      this.addEventTitle.value = this.addEventTitle.value.slice(0, 60);
    });

    // Asegura que los campos de tiempo tengan un formato adecuado
    this.addEventFrom.addEventListener("input", () => this.onTimeInput(this.addEventFrom));
    this.addEventTo.addEventListener("input", () => this.onTimeInput(this.addEventTo));

    //  añade un evento
    this.addEventSubmit.addEventListener("click", () => this.onAddEvent());

    // elimina un evento
    this.eventsContainer.addEventListener("click", (e: MouseEvent) => this.onDeleteEvent(e));

    console.log("al final de afterviewinit el eventsArray tiene ", this.eventsArr.length, " tareas")

  }


  initCalendar(): void {
    const firstDay: Date = new Date(this.year, this.month, 1); // Crea una fecha que representa el primer día del mes actual
    const lastDay: Date = new Date(this.year, this.month + 1, 0); // Crea una fecha que representa el primer día del mes actual.
    const prevLastDay: Date = new Date(this.year, this.month, 0); // Crea una fecha que representa el último día del mes anterior al actual
    const prevDays: number = prevLastDay.getDate(); // Obtiene el número total de días que tuvo el mes anterior
    const lastDate: number = lastDay.getDate(); // número total de días del mes actual
    const day: number = firstDay.getDay(); // Obtiene el día de la semana del 1er día del mes actual
    const nextDays: number = 7 - lastDay.getDay() - 1; // Esto sirve para llenar la última fila del calendario con los días del siguiente mes

    // muestra el título del mes en la parte superior del calendario

    this.date.innerHTML = this.months[this.month] + " " + this.year;

    // almacena el HTML de todos los días del calendario (como string)
    let days: string = "";

    // Agrega los días del mes anterior si el primer día del mes actual no es domingo
    for (let x: number = day; x > 0; x--) {
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    // recorre los días del mes actual
    for (let i: number = 1; i <= lastDate; i++) {
      let event: boolean = false; // esta funcion es para saber si el día tiene un evento registrado
      this.eventsArr.forEach((eventObj: EventDay) => { // recorre el arreglo de eventos y verifica si el día tiene eventos registrados
        if (
          eventObj.day === i &&
          eventObj.month === this.month + 1 &&
          eventObj.year === this.year
        ) {
          event = true; //marca el dia que tiene el evento
        }
      });
      if (
        i === new Date().getDate() &&
        this.year === new Date().getFullYear() &&
        this.month === new Date().getMonth()
      ) {
        this.activeDay = i;
        this.getActiveDay(i);
        this.updateEvents(i); // Llama a función para actualizar eventos del día
        if (event) {
          days += `<div class="day today active event">${i}</div>`;
        } else {
          days += `<div class="day today active">${i}</div>`;
        }
      } else {
        if (event) {
          days += `<div class="day event">${i}</div>`;
        } else {
          days += `<div class="day ">${i}</div>`;
        }
      }
    }

    // Agrega los días del mes siguiente que completan la última semana del calendario (relleno)
    for (let j: number = 1; j <= nextDays; j++) {
      days += `<div class="day next-date">${j}</div>`;
    }
    this.daysContainer.innerHTML = days;
    this.addListner();
  }

  // Retrocede al mes anterior
  prevMonth(): void {
    this.month--;
    if (this.month < 0) { // si el mes es menor que enero (0) va a diciembre del año anterior
      this.month = 11;
      this.year--;
    }
    this.initCalendar();
  }

  // avanza al siguiente mes
  nextMonth(): void {
    this.month++;
    if (this.month > 11) { // Si el mes es mayor a diciembre (11) va a enero del siguiente año
      this.month = 0;
      this.year++;
    }
    this.initCalendar(); // recarga el calendario con el nuevo mes/año
  }

  // va a la fecha actual (hoy) en el calendario
  goToday(): void {
    this.today = new Date(); // establece la fecha de hoy
    this.month = this.today.getMonth(); // Establece el mes actual según la fecha de hoy
    this.year = this.today.getFullYear(); // Establece el año actual según la fecha de hoy
    this.initCalendar();
  }

  // Función para manejar la entrada de fecha del usuario (input)
  // Esta función se activa cuando el usuario escribe en el campo de entrada de fechas
  onDateInput(e: Event): void {
    const inputEvent = e as InputEvent;
    this.dateInput.value = this.dateInput.value.replace(/[^0-9/]/g, "");
    if (this.dateInput.value.length === 2) {
      this.dateInput.value += "/";
    }
    if (this.dateInput.value.length > 7) {
      this.dateInput.value = this.dateInput.value.slice(0, 7);
    }
    if (inputEvent.inputType === "deleteContentBackward") {
      if (this.dateInput.value.length === 3) {
        this.dateInput.value = this.dateInput.value.slice(0, 2);
      }
    }
  }

  // Función para ir a una fecha específica basada en la entrada del usuario
  gotoDate(): void {
    const dateArr: string[] = this.dateInput.value.split("/"); // Divide la cadena de fecha escrita en el input en 2 partes usando la barra ("/")
    if (dateArr.length === 2) { // si la entrada tiene 2 partes (mes y año) 
      const inputMonth = parseInt(dateArr[0], 10); // convierte el mes a un numero entero
      const inputYear = parseInt(dateArr[1], 10); // convierte el año a un numero entero
      // Verifica si el mes y el año son válidos
      if (!isNaN(inputMonth) && !isNaN(inputYear) && inputMonth > 0 && inputMonth < 13 && dateArr[1].length === 4) {
        this.month = inputMonth - 1;
        this.year = inputYear; // asigna el año ingresado por el usuario
        this.initCalendar();
        return;
      }
    }
    this.showToast("Fecha incorrecta .. poner un ejemplito?");
  }

  // Función para agregar listeners a los días del calendario
  addListner(): void {
    const days: NodeListOf<HTMLElement> = document.querySelectorAll(".day"); // Selecciona todos los elementos con la clase "day"
    days.forEach((day: HTMLElement) => { // Recorre cada día

      day.addEventListener("click", (e: MouseEvent) => { // cuando el usuario hace click sobre un dia se ejecuta esta funcion
        const target = e.target as HTMLElement; // obtiene el elemento que fue clickeado
        const dayNumber = Number(target.innerHTML);
        this.getActiveDay(dayNumber); //
        this.updateEvents(dayNumber); // actualiza los eventos del día seleccionado 
        this.activeDay = dayNumber; // nos permite saber que dia fue seleccionado 

        // asegura que solo un día esté marcado como "activo" a la vez
        days.forEach((dayEl: HTMLElement) => {
          dayEl.classList.remove("active"); // elimina la clase "active" de todos los días
        });

        if (target.classList.contains("prev-date")) { // si el dia clickeado pertenece al mes anterior retrocede al mes anterior
          this.prevMonth();
          setTimeout(() => { // espera a que el calendario se actualice
            const days: NodeListOf<HTMLElement> = document.querySelectorAll(".day"); // selecciona todos los días nuevamente
            days.forEach((dayEl: HTMLElement) => {
              if ( // verifica si el día no pertenece al mes anterior y si el num del dia coincide con el clickeado
                !dayEl.classList.contains("prev-date") &&
                dayEl.innerHTML === target.innerHTML
              ) {
                dayEl.classList.add("active");
              }
            });
          }, 100);
        } else if (target.classList.contains("next-date")) { // si el dia clickeado pertenece al mes siguiente avanza al mes siguiente
          this.nextMonth();
          setTimeout(() => {
            const days: NodeListOf<HTMLElement> = document.querySelectorAll(".day");
            days.forEach((dayEl: HTMLElement) => {
              if (
                !dayEl.classList.contains("next-date") && // verifica si el dia no pertenece al mes siguiente
                dayEl.innerHTML === target.innerHTML // verifica si el dia coincide con el clickeado
              ) {
                dayEl.classList.add("active");
              }
            });
          }, 100);
        } else {
          target.classList.add("active"); // si el dia clickeado es del mes actual marca como activo
        }
      });
    });
  }

  // Función para obtener el nombre del día y la fecha seleccionada en el calendario
  getActiveDay(day: number): void {
    const dateObj: Date = new Date(this.year, this.month, day); // crea un objeto de fecha con el año, mes y día seleccionados 
    const diasSemana: string[] = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const nombreDia: string = diasSemana[dateObj.getDay()]; // obtiene el nombre del día de la semana seleccionada
    this.eventDay.innerHTML = nombreDia; // muestra el nombre del día
    this.eventDate.innerHTML = `${day} ${this.months[this.month]} ${this.year}`;
  }

  // Función para actualizar los eventos del día seleccionado.
  updateEvents(date: number): void {
    let events: string = "";
    this.eventsArr.forEach((event: EventDay) => { // recorre el arreglo de eventos para buscar los eventos del día seleccionado.
      if ( // verifica si el día, mes y año del evento coinciden con el día seleccionado.
        date === event.day &&
        this.month + 1 === event.month &&
        this.year === event.year
      ) {
        event.events.forEach((eventItem: CalendarEvent) => {
          // crea el HTML para mostrar los eventos
          events += `<div class="event">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${eventItem.title}</h3>
              </div>
              <div class="event-time">
                <span class="event-time">${eventItem.time}</span>
              </div>
          </div>`;
        });
      }
    });
    // Si no hay eventos para ese dia, muestra el mensaje "no hay eventos"
    if (events === "") {
      events = `<div class="no-event">
              <h3>No hay Eventos</h3>
          </div>`;
    }
    this.eventsContainer.innerHTML = events;
    //no se si deberiaguardarlo en esta instancia
    //this.saveEvents();
  }

  // Función que maneja la entrada del campo de hora.
  onTimeInput(input: HTMLInputElement): void {
    input.value = input.value.replace(/[^0-9:]/g, ""); // Elimina caracteres no numericos o ":"
    if (input.value.length === 2) { // Si el campo tiene 2 caracteres, agrega ":"
      input.value += ":";
    }
    if (input.value.length > 5) { // Si el campo tiene más de 5 caracteres, corta el valor a los primeros 5
      input.value = input.value.slice(0, 5);
    }
  }
  // funcion cuando se añade un evento
  onAddEvent(): void {
    // Toma los valores de los campos de entrada de título y hora.
    const eventTitle: string = this.addEventTitle.value;
    const eventTimeFrom: string = this.addEventFrom.value;
    const eventTimeTo: string = this.addEventTo.value;
    // si alguno de los campos está vacio muestra una alerta
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      this.showToast("Por favor, completa todos los campos");
      return;
    }
    // convierte las horas de inicio y fin en arreglos (desde/hasta)
    const timeFromArr: string[] = eventTimeFrom.split(":");
    const timeToArr: string[] = eventTimeTo.split(":");
    // verifica si el formato de la hora es correcto
    if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      parseInt(timeFromArr[0], 10) > 23 || // verifica si la hora  de inicio es mayor a 23
      parseInt(timeFromArr[1], 10) > 59 || // verifica si los minutos de inicio son mayores a 59
      parseInt(timeToArr[0], 10) > 23 || // verifica si la hora de fin es mayor a 23
      parseInt(timeToArr[1], 10) > 59 // verifica si los minutos de fin son mayores a 59
    ) {
      this.showToast("Formato de hora incorrecto");
      return;
    }
    // convierte las horas en el formato adecuado
    const timeFrom: string = this.convertTime(eventTimeFrom);
    const timeTo: string = this.convertTime(eventTimeTo);


    let eventExist: boolean = false; // verifica si el evento ya existe
    this.eventsArr.forEach((event: EventDay) => {
      if ( // verifica si el dia, mes y año del evento coinciden con el dia seleccionado
        event.day === this.activeDay &&
        event.month === this.month + 1 &&
        event.year === this.year
      ) {
        event.events.forEach((eventItem: CalendarEvent) => {
          if (eventItem.title === eventTitle) { // verifica si el titulo del evento existe
            eventExist = true;
          }
        });
      }
    });
    if (eventExist) {
      this.showToast("Ya existe un evento con ese título");
      return;
    }

    // Crea un nuevo evento con el título y la hora ingresada
    const newEvent: CalendarEvent = {
      title: eventTitle,
      time: timeFrom + " - " + timeTo,
    };
    let eventAdded: boolean = false; // verifica si el evento fue añadido
    // verifica si hay eventos guardados
    if (this.eventsArr.length > 0) {
      this.eventsArr.forEach((item: EventDay) => {
        if ( // verifica si el dia, mes y año del evento coinciden con el dia seleccionado
          item.day === this.activeDay &&
          item.month === this.month + 1 &&
          item.year === this.year
        ) {
          item.events.push(newEvent);
          eventAdded = true; // marca que el evento fue añadido 
        }
      });
    }

    // si no hay eventos guardados los crea
    if (!eventAdded) {
      this.eventsArr.push({
        day: this.activeDay, // 
        month: this.month + 1,
        year: this.year,
        events: [newEvent], // 
      });
    }
    // actualiza la vista del calendario y los eventos
    this.addEventWrapper.classList.remove("active");
    // limpia los campos de entrada
    this.addEventTitle.value = "";
    this.addEventFrom.value = "";
    this.addEventTo.value = "";

    // actualiza la vista de los eventos 
    this.updateEvents(this.activeDay);

    // Es decir, busca el día del calendario que está actualmente seleccionado.
    // y le añade la clase "event" para marcarlo como un día con eventos.
    // Esto se hace para que el día seleccionado tenga un estilo diferente si tiene eventos.
    const activeDayEl: HTMLElement | null = document.querySelector(".day.active");
    if (activeDayEl && !activeDayEl.classList.contains("event")) { // 
      activeDayEl.classList.add("event");  // Si no tiene la clase "event", se la agrega.
      // sirve para marcar visualmente en el calendario que ese día tiene al menos un evento
    }

    //guardar en db?
    this.saveEvents();
  }

  // Función para eliminar un evento al hacer clic en él
  onDeleteEvent(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const eventDiv = target.closest(".event") as HTMLElement | null; // Busca el elemento padre más cercano con la clase "event"

    if (eventDiv) { // confirma que el usuario quiere eliminar el evento
      if (confirm("Está seguro que quiere eliminar éste evento?")) {
        const eventTitleElement = eventDiv.querySelector(".event-title") as HTMLElement | null; // obtengo el título del evento desde el DOM

        // Si el elemento existe, obtengo su contenido
        // y busco en el arreglo de eventos para eliminarlo
        if (eventTitleElement) {
          const eventTitle: string = eventTitleElement.innerHTML;
          this.eventsArr.forEach((event: EventDay) => {
            if ( // verifica si el dia, mes y año del evento coinciden con el evento que deseo eliminar
              event.day === this.activeDay &&
              event.month === this.month + 1 &&
              event.year === this.year
            ) {
              // busca el indice del evento por su titulo
              const itemIndex = event.events.findIndex(item => item.title === eventTitle);
              // si el evento existe lo elimina
              if (itemIndex !== -1) {
                event.events.splice(itemIndex, 1);
              }

              // Si no hay eventos en el día, lo elimina del arreglo de eventos

              if (event.events.length === 0) {
                const eventDayIndex = this.eventsArr.indexOf(event); // busca la posicion dia actual dentro de eventsArray
                if (eventDayIndex !== -1) { // si el indice (posicion) es valido
                  this.eventsArr.splice(eventDayIndex, 1); // entonces elimina ese dia completo del arreglo de eventos
                }

                // Elimina la clase "event" del día activo en el calendario
                // Esto es para que el día no esté marcado como un día con eventos si ya no tiene ninguno.
                const activeDayEl: HTMLElement | null = document.querySelector(".day.active");
                if (activeDayEl && activeDayEl.classList.contains("event")) {
                  activeDayEl.classList.remove("event");
                }
              }
            }
          });
          this.updateEvents(this.activeDay); // actualiza los eventos que se muestran en pantalla
        }
      }
    }
  }
  // Guarda los eventos en el localStorage
  // Esto permite que los eventos persistan incluso si el usuario recarga la página o cierra la aplicación.
  async saveEvents() {
    /* guardar la info en localStorage, esto no sirve hay que cambiarlo */
    //localStorage.setItem("events", JSON.stringify(this.eventsArr));
    /* en su lugar quedaría algo así */

    try {
      // Obtener el usuario autenticado desde Firebase
      const userFirebase = this.auth.getCurrentUser();
      this.userService.saveEventsArray(userFirebase!.email!, this.eventsArr)
    }
    catch (error) {
      console.error("Error al guardar los eventos del usuario:", error);
      this.showToast("Error al guardar los eventos del usuario: " + error);
    }
  }

  // Recupera los eventos del localStorage
  // Esto se hace al cargar la página para mostrar los eventos guardados previamente.
  
  // ESTO ROMPE TODO PERO QUE YO SEPA NO SE ESTÁ ACTIVANDO NUNCA igual lo comento
/*   getEvents(): void {
    
    const storedEvents = localStorage.getItem("events");
    if (storedEvents === null) { // si no hay nada guardado sale de la funcion 
      return;
    }
    try {
      // Intenta convertir el texto guardado en un arreglo de eventos.
      const parsedEvents: EventDay[] = JSON.parse(storedEvents);

      // Limpia el arreglo actual y agrega los eventos recuperados.
      // Esto asegura que el arreglo de eventos siempre esté actualizado con los datos del localStorage.
      this.eventsArr.length = 0;
      this.eventsArr.push(...parsedEvents);
    } catch (e) { // Si hay un error al analizar los eventos, muestra un mensaje de error en la consola
      // y elimina el elemento del localStorage para evitar problemas futuros.
      console.error("Error al leer los eventos guardados en el almacenamiento local", e);
      localStorage.removeItem("events");
    }
  } */

  // Convierte la hora de 24 horas a 12 horas con formato AM/PM
  convertTime(time: string): string {
    let timeArr: string[] = time.split(":"); // Separa la hora y los minutos
    let timeHour: number = parseInt(timeArr[0], 10); // convierte la hora a num entero 
    let timeMin: string = timeArr[1]; // obtiene los min como texto
    let timeFormat: string = timeHour >= 12 ? "PM" : "AM"; // determina si es AM o PM
    timeHour = timeHour % 12 || 12; // convierte la hora en formato 12 horas
    const formattedTimeHour: string = timeHour.toString().padStart(2, '0'); // asegura que la hora tenga 2 digitos
    time = formattedTimeHour + ":" + timeMin + " " + timeFormat; // Forma final del texto: "hh:mm AM/PM"

    return time;
  }


}


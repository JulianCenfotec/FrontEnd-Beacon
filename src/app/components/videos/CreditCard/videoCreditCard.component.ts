import {Component, ElementRef, ViewChild} from '@angular/core';
import { IChapter } from '../../../interfaces';
import {setFaviconBeacon} from "../../../utility/page-icon.utility";

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [],
  templateUrl: './videoCreditCard.component.html',
  styleUrl: './videoCreditCard.component.scss'
})
export class VideoCreditCardComponent {
  private windowTitle = "Tu tarjeta de crédito ideal | Videos Interactivos | Beacon";
  @ViewChild('videoElement') videoElement!: ElementRef;
  public currentChapter:IChapter= {
    id: 0,
    name: "",
    description: "",
    videoUrl: "",
    options: [],
    pastOptions: []
  };
  public chapters : IChapter[] = [
    {
      "id": 1,
      "name": "¿Qué tipo de beneficios le atraen más?",
      "description": "Esto nos permitira recomendarte la tarjeta correcta segun los beneficios que se adapten a tus necesidades.",
      "videoUrl": "https://i.imgur.com/1O4i0lq.mp4",
      "options": [
        {"id": 1, "name": "Supermercados y clubes", "ChapterId": 2},
        {"id": 2, "name": "Viajes","ChapterId": 3},
        {"id": 3, "name": "Recompensas","ChapterId": 4},
        {"id": 4, "name": "Cashback","ChapterId": 5},
        {"id": 5, "name": "Salud y deporte","ChapterId": 6},
        {"id": 6, "name": "Sólo credito","ChapterId": 7}
      ],
      "pastOptions": [
        {"ChapterId": 1}
      ]
    },
    {
      "id": 2,
      "name": "¿Qué plan de lealtad te llama más la atención?",
      "description": "Indicanos cual es tu supermercado o clud de preferencia para darte una recomendación ideal, si no tienes un supermercado preferido puedes seleccionar la opción 'Otro'.",
      "videoUrl": "https://i.imgur.com/KDvY7xw.mp4",
      "options": [
        {"id": 1, "name": "Walmart", "ChapterId": 26},
        {"id": 2, "name": "PriceSmart","ChapterId": 27},
        {"id": 3, "name": "Auto Mercado","ChapterId": 28},
        {"id": 4, "name": "Club La Nación Prepago","ChapterId": 29},
        {"id": 5, "name": "Otro","ChapterId": 30}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2}
      ]
    },
    {
      "id": 3,
      "name": "¿Qué aerolinea prefieres?",
      "description": "Escoger una aerolinea te va a permitir acumular mas millas en esta, las cueales podras cambiar por descuentos o vuelos gratis. Ten encuenta que estas tarjetas suelen contas con muchos beneficios para los viajeros como seguros y accesos a salas VIP en muchos aeropuertos.",
      "videoUrl": "https://i.imgur.com/JwjjRWu.mp4",
      "options": [
        {"id": 1, "name": "American Airlines", "ChapterId": 31},
        {"id": 2, "name": "CopaAirlines","ChapterId": 35},
        {"id": 3, "name": "Avianca","ChapterId": 32},
        {"id": 4, "name": "Free Spirit","ChapterId": 38},
        {"id": 5, "name": "Iberia","ChapterId": 39},
        {"id": 6, "name": "No es relevante","ChapterId": 40}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3}
      ]
    },
    {
      "id": 4,
      "name": "¿Con qué banco desea ganar recompensas?",
      "description": "Todos estos bancos ofrecen planes de lealtad con distintos tipos de recompensas como la acumulacion de puntos, descuentos y creditos sin intrereses, indicanos tu banco de preferencia para recomendarte la mejor opción.",
      "videoUrl": "https://i.imgur.com/nAijzzO.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 20},
        {"id": 2, "name": "Scotiabank","ChapterId": 21},
        {"id": 3, "name": "Banco Nacional","ChapterId": 22},
        {"id": 4, "name": "Banco Popular","ChapterId": 23},
        {"id": 5, "name": "BCR","ChapterId": 24},
        {"id": 6, "name": "Promerica","ChapterId":25}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4}
      ]
    },
    {
      "id": 5,
      "name": "¿Cómo piensas utilizar esta tarjeta?",
      "description": "Los planes cashback varian sus porcentajes dependiendo el uso que se les, cuentanos que tipo de compras haras.",
      "videoUrl": "https://i.imgur.com/zn5vBid.mp4",
      "options": [
        {"id": 1, "name": "Gasolineras", "ChapterId": 17},
        {"id": 2, "name": "Compras de todo tipo","ChapterId": 14},
        {"id": 3, "name": "Compra de vehiculos Veinsa","ChapterId": 13},
        {"id": 4, "name": "Soy ciudadano de oro","ChapterId": 12}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5}
      ]
    },
    {
      "id": 6,
      "name": "¿Qué plan le interesa más?",
      "description": "Con estas tarjetas podras disfrutar de descuentos en farmacias, tratamientos de belleza, salud, cuidado personal y ópticas.",
      "videoUrl": "https://i.imgur.com/z61evVs.mp4",
      "options": [
        {"id": 1, "name": "Salud", "ChapterId": 10},
        {"id": 2, "name": "Deporte","ChapterId": 12}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 6}
      ]
    },
    {
      "id": 7,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Estas opciones le permitiran acceder a una tarjeta de credito con interes menor, perfecta para personas que solo buscan una forma de pago y que no necesitan de beneficios adicionales.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 8},
        {"id": 2, "name": "Coopealianza","ChapterId": 9}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 7}
      ]
    },
    {
      "id": 35,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Indicanos con cual de estas instituciones utilizas regularmente.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 36},
        {"id": 2, "name": "Promerica","ChapterId": 37}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 35}
      ]
    },
    {
      "id": 32,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Indicanos con cual de estas instituciones utilizas regularmente.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 33},
        {"id": 2, "name": "Scotiabank","ChapterId": 34}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 32}
      ]
    },
    {
      "id": 40,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Indicanos con cual de estas instituciones utilizas regularmente.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 41},
        {"id": 2, "name": "BCR","ChapterId": 42},
        {"id": 3, "name": "Promerica","ChapterId": 43}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 40}
      ]
    },
    {
      "id": 17,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Indicanos con cual de estas instituciones utilizas regularmente.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "Scotiabank", "ChapterId": 19},
        {"id": 2, "name": "Promerica","ChapterId": 18}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 17}
      ]
    },
    {
      "id": 14,
      "name": "¿Cuál institución financiera prefiere?",
      "description": "Indicanos con cual de estas instituciones utilizas regularmente.",
      "videoUrl": "https://i.imgur.com/MyoX4sU.mp4",
      "options": [
        {"id": 1, "name": "BAC", "ChapterId": 16},
        {"id": 2, "name": "Scotiabank","ChapterId": 15}
      ],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 14}
      ]
    },
    {
      "id": 8,
      "name": "Esta es nuestra recomendación",
      "description": "La Visa Optima 2% ofrece un bajo interes en el mercado y es justo lo necesario para poder disfrutar de una tarjeta de credito. Link: https://www.baccredomatic.com/es-cr/personas/tarjetas/destacadas/optima-visa/visa/clasica.",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 7},
        {"ChapterId": 8}
      ]
    },
    {
      "id": 9,
      "name": "Esta es nuestra recomendación",
      "description": "Coopealianza ofrece distintas tarjetas Visa que se adaptan a tu necesidad, acá puedes ver mas información: https://coopealianza.fi.cr/tarjetas-de-credito-y-debito/ .",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 7},
        {"ChapterId": 9}
      ]
    },
    {
      "id": 10,
      "name": "Esta es nuestra recomendación",
      "description": "La tarjeta viva salud del Banco de Costa Rica es lo que estás buscando, mirala en este enlace: https://www.bancobcr.com/wps/portal/bcr/bancobcr/personas/tarjetas/tc_mastercard_viva_salud .",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 7},
        {"ChapterId": 10}
      ]
    },
    {
      "id": 11,
      "name": "Esta es nuestra recomendación",
      "description": "La tarjeta Activa deportes del Banco Popular es lo que estás buscando, mirala en este enlace: https://www.bancopopular.fi.cr/tarjetas-de-credito-visa/ .",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 7},
        {"ChapterId": 11}
      ]
    },
    {
      "id": 13,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica te ofrece la Visa Veinsa Motors, que te da puntos por comprar con Veinsa y en las gasolineras del pais, mira los detalles acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=Veinsa&Id=48996.",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 13}
      ]
    },
    {
      "id": 12,
      "name": "Esta es nuestra recomendación",
      "description": "Esta tarjeta exclusiva para personas mayores a los 65 años te ofreces muchos beneficios en tu dia a dia, mira los detalleas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/estilo-de-vida/tarjeta-ciudadano-de-oro-libertad/mastercard/clasica.",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 12}
      ]
    },
    {
      "id": 20,
      "name": "Esta es nuestra recomendación",
      "description": "El Bac ofrece su plan Gane Premios con Visa, MasterCard y AMEX. Con esta ultima ofrece el exclusivo programa de Membership Rewards, el cual es solo por invitacion. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.baccredomatic.com/es-cr/personas/tarjetas/destacadas/millas-gane-premios/visa/clasica.",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 20}
      ]
    },
    {
      "id": 21,
      "name": "Esta es nuestra recomendación",
      "description": "Scotiabank ofrece su plan +Premios con Visa y MasterCard. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.scotiabankcr.com/personas/tarjetas-de-credito/premios/visa-clasica.aspx",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 21}
      ]
    },
    {
      "id": 22,
      "name": "Esta es nuestra recomendación",
      "description": "El Banco Nacional ofrece beneficios con distintas tarjetas Visa y MasterCard, Beneficios especiales con la aerolinea Avianca. Ademas de su linea Mujer que da beneficios especiales a las mujeres que deseen ser parte de este. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.bncr.fi.cr/tarjeta-credito-internacional",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 22}
      ]
    },
    {
      "id": 23,
      "name": "Esta es nuestra recomendación",
      "description": "El Banco Popular ofrece beneficios con distintas tarjetas Visa y MasterCard. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.bancopopular.fi.cr/tarjetas-de-credito-visa/",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 23}
      ]
    },
    {
      "id": 24,
      "name": "Esta es nuestra recomendación",
      "description": "El Banco de Costa Rica ofrece beneficios con distintas tarjetas Visa y MasterCard. Ademas, presenta su exclusivo plan preferentes para sus mejores clientes. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.bancobcr.com/wps/portal/bcr/bancobcr/personas/tarjetas/tc_visa_clasica",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 24}
      ]
    },
    {
      "id": 25,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece beneficios con distintos planes de lealtad Visa, como Emerald y premia plus. Ademas, de planes especiales con la UAM, Ulatina y Universal. Conoce más sobre los beneficios de este plan de lealtad en este link: https://www.promerica.fi.cr/banca-de-personas/tarjetas-de-credito/",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 4},
        {"ChapterId": 25}
      ]
    },
    {
      "id": 19,
      "name": "Esta es nuestra recomendación",
      "description": "Scotiabank ofrece este plan que te permitira ahorrar al comprar gasolina. Conoce mas de esta tarjeta acá: https://www.scotiabankcr.com/personas/tarjetas-de-credito/cash-back/mastercard-combustible.aspx",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 17},
        {"ChapterId": 19}
      ]
    },
    {
      "id": 19,
      "name": "Esta es nuestra recomendación",
      "description": "Scotiabank ofrece este plan que te permitira ahorrar al comprar gasolina. Conoce mas de esta tarjeta acá: https://www.scotiabankcr.com/personas/tarjetas-de-credito/cash-back/mastercard-combustible.aspx",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 17},
        {"ChapterId": 19}
      ]
    },
    {
      "id": 18,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece este plan que te permitira ahorrar al comprar gasolina. Conoce mas de esta tarjeta acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=PremiaAuto&Id=48981",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 17},
        {"ChapterId": 18}
      ]
    },
    {
      "id": 16,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece muchos tipos de tarjetas cashback con Visa, AMEX y MasterCard. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/destacadas/blue-american-express/american-express/blue",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 14},
        {"ChapterId": 16}
      ]
    },
    {
      "id": 15,
      "name": "Esta es nuestra recomendación",
      "description": "Scotiabank ofrece  tarjetas cashback con MasterCard. Conoce mas acá: https://www.scotiabankcr.com/personas/tarjetas-de-credito/cash-back/mastercard-clasica.aspx",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 5},
        {"ChapterId": 14},
        {"ChapterId": 15}
      ]
    },
    {
      "id": 36,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece el programa ConnetMiles con Visa, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/viajes/connectmiles-visa-infinite/visa/infinite",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 35},
        {"ChapterId": 36}
      ]
    },
    {
      "id": 37,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece el programa ConnetMiles con Visa, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=ConnectMiles&Id=48998",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 35},
        {"ChapterId": 37}
      ]
    },
    {
      "id": 33,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece el programa LifeMiles con Visa, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/destacadas/lifemiles-avianca-elite/american-express/black",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 32},
        {"ChapterId": 33}
      ]
    },
    {
      "id": 34,
      "name": "Esta es nuestra recomendación",
      "description": "Scotiabank ofrece el programa LifeMiles con Visa, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.scotiabankcr.com/personas/tarjetas-de-credito/lifemiles/lifemiles-platinum.aspx",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 32},
        {"ChapterId": 34}
      ]
    },
    {
      "id": 31,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece el programa Aadvantage Prestige con Visa, AMEX y Mastercard, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/viajes/aadvantager-prestige/american-express/prestige",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 31}
      ]
    },
    {
      "id": 38,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece el programa Spirit con Mastercard, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=Spirit&Id=48990",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 38}
      ]
    },
    {
      "id": 39,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece el programa Iberia con Visa, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=Iberia&Id=48995",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 39}
      ]
    },
    {
      "id": 43,
      "name": "Esta es nuestra recomendación",
      "description": "Promerica ofrece el programa Premia Travel con Visa y Mastercard, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=PremiaTravel&Id=48986",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 40},
        {"ChapterId": 43}
      ]
    },
    {
      "id": 42,
      "name": "Esta es nuestra recomendación",
      "description": "BCR ofrece Visa Jade, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.bancobcr.com/wps/portal/bcr/bancobcr/personas/tarjetas/tc_mastercard_jade",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 40},
        {"ChapterId": 42}
      ]
    },
    {
      "id": 41,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece Millas Plus con Visa, Mastercard y AMEX, que te permitira acumular millas para tus viajes. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/destacadas/millas-plus-infinite-visa/visa/infinite",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 3},
        {"ChapterId": 40},
        {"ChapterId": 41}
      ]
    },
    {
      "id": 26,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece una alianza con la cadena de supermercados de Walmart con AMEX, que te permitira ahorrar un 5% en tus compras. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/supermercados-y-clubes/walmart-clasica/american-express/clasica",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2},
        {"ChapterId": 26}
      ]
    },
    {
      "id": 27,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece una alianza con la cadena de clubs Pricesmart con Visa, que te permitira ahorrar un 4% en tus compras. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/supermercados-y-clubes/pricesmart-visa/visa/clasica",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2},
        {"ChapterId": 27}
      ]
    },
    {
      "id": 28,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece una alianza con la cadena Automercado con Mastercard y AMEX, que te permitira ahorrar un 3% en tus compras. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/supermercados-y-clubes/auto-mercado-mastercardr-gold/mastercard/dorada",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2},
        {"ChapterId": 28}
      ]
    },
    {
      "id": 29,
      "name": "Esta es nuestra recomendación",
      "description": "BAC ofrece una alianza con La Nacion y AMEX, que te permitira ahorrar un 3% en tus compras. Conoce mas acá: https://www.baccredomatic.com/es-cr/personas/tarjetas/estilo-de-vida/club-la-nacion-prepago/american-express/clasica",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2},
        {"ChapterId": 29}
      ]
    },
    {
      "id": 30,
      "name": "Esta es nuestra recomendación",
      "description": "Si no tienes un supermercado o club de preferencia, te recomendamos la tarjeta de credito de Promerica con Visa y Mastercard, la cual te ofrece un 3% de cashback en todos los supermercados. Conoce mas acá: https://www.promerica.fi.cr/banca-de-personas/detalle-tarjetas/?Tarjeta=PremiaS%C3%BAper&Id=48982",
      "videoUrl": "https://i.imgur.com/5JYXogL.mp4",
      "options": [],
      "pastOptions": [
        {"ChapterId": 1},
        {"ChapterId": 2},
        {"ChapterId": 30}
      ]
    }
  ];


  seekToTime(seconds: number) {
    this.videoElement.nativeElement.currentTime = seconds;
    this.videoElement.nativeElement.play()

  }
  changeChapter(nextChapterId: number) {
    this.setCurrentChapterById(nextChapterId);
    this.videoElement.nativeElement.src =this.currentChapter.videoUrl;
  }
  setCurrentChapterById(chapterId: number) {
    const foundChapter = this.chapters.find(chapter => chapter.id === chapterId);
    if (foundChapter) {
      this.currentChapter = foundChapter;
      console.log(this.currentChapter.videoUrl);
    } else {
      console.error(`Chapter with ID ${chapterId} not found`);
    }
  }
  getChapterById(chapterId: number) {
    return this.chapters.find(chapter => chapter.id === chapterId);
  }


  constructor() {
    this.setCurrentChapterById(1)
    window.document.title = this.windowTitle;
    setFaviconBeacon();
  }

}

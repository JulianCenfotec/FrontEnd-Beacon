
import { PlanGeneralService } from "../../../../services/generalPlan.service";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { IGasto } from "../../../../interfaces";

export function getGastosDelMes(
  planGeneralService: PlanGeneralService,
  monthYear: string
): Observable<any[]> {
  return planGeneralService.getCalendarioFromUserSignal().pipe(
    map((data) => {
      const gastosDelMes: { [name: string]: number } = {};

      data.forEach((calendario) => {
        calendario.calendarioPlans.forEach((plan) => {
          const fechaInicio = new Date(plan.fechaInicio);
          const planMonthYear = `${fechaInicio.getFullYear()}-${(
            "0" +
            (fechaInicio.getMonth() + 1)
          ).slice(-2)}`;

          if (planMonthYear === monthYear) {
            plan.plan.gastos.forEach((gasto) => {
              if (!gastosDelMes[gasto.nombre]) {
                gastosDelMes[gasto.nombre] = 0;
              }
              gastosDelMes[gasto.nombre] += gasto.monto;
            });
          }
        });

        calendario.calendarioGastosImprevistos.forEach((calendarioGastosImprevistos) => {
          const fechaInicio = new Date(calendarioGastosImprevistos.fechaInicio);
          const planMonthYear = `${fechaInicio.getFullYear()}-${(
            "0" +
            (fechaInicio.getMonth() + 1)
          ).slice(-2)}`;

          if (planMonthYear === monthYear) {
            const gasto = calendarioGastosImprevistos.gasto;

            if (gasto) {
              if (!gastosDelMes[gasto.nombre]) {
                gastosDelMes[gasto.nombre] = 0;
              }
              gastosDelMes[gasto.nombre] += gasto.monto;
            }
          }
        });
      });

      return Object.keys(gastosDelMes).map((name) => ({
        name: name,
        value: gastosDelMes[name],
      }));
    })
  );
}
  

export function HistorialPorMes(
  planGeneralService: PlanGeneralService,
  selectedMonthYear: string
): Observable<any[]> {
  return planGeneralService.getCalendarioFromUserSignal().pipe(
    map((data) => {
      const [year, month] = selectedMonthYear.split('-').map(Number);
      const startDate = new Date(year, month - 6, 1);
      const endDate = new Date(year, month, 0);

      const gastosPorMes: {
        [monthYear: string]: { gasto: number; ingreso: number };
      } = {};

      data.forEach((calendario) => {
        calendario.calendarioPlans.forEach((plan) => {
          const fechaInicio = new Date(plan.fechaInicio);
          const planMonthYear = `${fechaInicio.getFullYear()}-${(
            "0" +
            (fechaInicio.getMonth() + 1)
          ).slice(-2)}`;

          if (fechaInicio >= startDate && fechaInicio <= endDate) {
            if (!gastosPorMes[planMonthYear]) {
              gastosPorMes[planMonthYear] = { gasto: 0, ingreso: 0 };
            }

            plan.plan.gastos.forEach((gasto) => {
              gastosPorMes[planMonthYear].gasto += gasto.monto;
            });
            plan.plan.ingresos.forEach((ingreso) => {
              gastosPorMes[planMonthYear].ingreso += ingreso.monto;
            });
          }
        });

        calendario.calendarioGastosImprevistos.forEach((calendarioGastosImprevistos) => {
          const fechaInicio = new Date(calendarioGastosImprevistos.fechaInicio);
          const planMonthYear = `${fechaInicio.getFullYear()}-${(
            "0" +
            (fechaInicio.getMonth() + 1)
          ).slice(-2)}`;

          if (fechaInicio >= startDate && fechaInicio <= endDate) {
            if (!gastosPorMes[planMonthYear]) {
              gastosPorMes[planMonthYear] = { gasto: 0, ingreso: 0 };
            }

            const gasto = calendarioGastosImprevistos.gasto;
            if (gasto) {
              gastosPorMes[planMonthYear].gasto += gasto.monto;
            }
          }
        });

        calendario.calendarioIngresosImprevistos.forEach((calendarioIngresosImprevistos) => {
          const fechaInicio = new Date(calendarioIngresosImprevistos.fechaInicio);
          const planMonthYear = `${fechaInicio.getFullYear()}-${(
            "0" +
            (fechaInicio.getMonth() + 1)
          ).slice(-2)}`;

          if (fechaInicio >= startDate && fechaInicio <= endDate) {
            if (!gastosPorMes[planMonthYear]) {
              gastosPorMes[planMonthYear] = { gasto: 0, ingreso: 0 };
            }

            const ingreso = calendarioIngresosImprevistos.ingreso;
            if (ingreso) {
              gastosPorMes[planMonthYear].ingreso += ingreso.monto;
            }
          }
        });
      });

      const formatMonthYear = (monthYear: string): string => {
        const [year, month] = monthYear.split('-').map(Number);
        const monthNamesSpanish = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${monthNamesSpanish[month - 1]}, ${year}`;
      };

      const sortedEntries = Object.keys(gastosPorMes).map((monthYear) => ({
        name: formatMonthYear(monthYear),
        series: [
          {
            name: "Ingreso",
            value: gastosPorMes[monthYear].ingreso,
          },
          {
            name: "Gasto",
            value: gastosPorMes[monthYear].gasto,
          },
        ],
      })).sort((a, b) => {
        const [monthA, yearA] = a.name.split(', ');
        const [monthB, yearB] = b.name.split(', ');

        const monthNamesSpanish = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const monthIndexA = monthNamesSpanish.indexOf(monthA);
        const monthIndexB = monthNamesSpanish.indexOf(monthB);

        return (parseInt(yearA) - parseInt(yearB)) || (monthIndexA - monthIndexB);
      });

      return sortedEntries;
    })
  );
}

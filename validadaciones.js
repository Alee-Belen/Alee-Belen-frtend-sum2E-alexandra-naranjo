document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const especialidadSelect = document.getElementById("especialidad");
    const medicoSelect = document.getElementById("medico");
    const modalidadSelect = document.getElementById("modalidad");
    const plataformaContainer = document.getElementById("plataforma-container");
    const coberturaSelect = document.getElementById("cobertura");
    const credencialContainer = document.getElementById("credencial-container");
    const planContainer = document.getElementById("plan-container");
    const primeraVisitaCheckbox = document.getElementById("primera-visita");
    const comoNosConocioContainer = document.getElementById("como-nos-conocio-container");
    const estudiosPreviosCheckbox = document.getElementById("estudios-previos");
    const descripcionEstudiosContainer = document.getElementById("descripcion-estudios-container");

    // Objeto de médicos por especialidad
    const medicosPorEspecialidad = {
        "clinica-general": ["Dr. Juan Pérez", "Dra. María Gómez"],
        "cardiologia": ["Dr. Carlos López", "Dra. Ana Torres"],
        "pediatria": ["Dr. Luis Martínez", "Dra. Sofía Ramírez"],
        "ginecologia": ["Dra. Laura Fernández", "Dr. Pedro Sánchez"],
        "traumatologia": ["Dr. Andrés García", "Dra. Paula Díaz"],
        "neurologia": ["Dr. Javier Herrera", "Dra. Elena Cruz"]
    };

    // Función para mostrar/ocultar campos dinámicos
    const toggleField = (container, condition) => {
        container.style.display = condition ? "block" : "none";
    };

    // Actualizar médicos según la especialidad seleccionada
    especialidadSelect.addEventListener("change", () => {
        const especialidad = especialidadSelect.value;
        medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>';
        if (especialidad && medicosPorEspecialidad[especialidad]) {
            medicosPorEspecialidad[especialidad].forEach(medico => {
                const option = document.createElement("option");
                option.value = medico;
                option.textContent = medico;
                medicoSelect.appendChild(option);
            });
            medicoSelect.disabled = false;
        } else {
            medicoSelect.disabled = true;
        }
    });

    // Mostrar plataforma preferida si la modalidad es "Videoconsulta"
    modalidadSelect.addEventListener("change", () => {
        toggleField(plataformaContainer, modalidadSelect.value === "videoconsulta");
    });

    // Mostrar credencial y plan si la cobertura no es "Particular"
    coberturaSelect.addEventListener("change", () => {
        const isParticular = coberturaSelect.value === "particular";
        toggleField(credencialContainer, !isParticular);
        toggleField(planContainer, !isParticular);
    });

    // Mostrar "Como nos conoció" si es la primera visita
    primeraVisitaCheckbox.addEventListener("change", () => {
        toggleField(comoNosConocioContainer, primeraVisitaCheckbox.checked);
    });

    // Mostrar descripción de estudios si tiene estudios previos
    estudiosPreviosCheckbox.addEventListener("change", () => {
        toggleField(descripcionEstudiosContainer, estudiosPreviosCheckbox.checked);
    });

    // Validar campos del formulario
    const validarCampo = (campo, regla, mensaje) => {
        const valor = campo.value.trim();
        const mensajeError = campo.nextElementSibling;
        if (!regla(valor)) {
            campo.classList.add("campo-error");
            campo.classList.remove("campo-ok");
            if (mensajeError) mensajeError.textContent = mensaje;
            return false;
        } else {
            campo.classList.remove("campo-error");
            campo.classList.add("campo-ok");
            if (mensajeError) mensajeError.textContent = "";
            return true;
        }
    };

    // Reglas de validación
    const reglas = {
        nombre: valor => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor),
        dni: valor => /^\d{7,8}$/.test(valor),
        email: valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
        telefono: valor => /^[+\d\s-]{8,}$/.test(valor),
        fechaNacimiento: valor => {
            const fecha = new Date(valor);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fecha.getFullYear();
            return fecha <= hoy && edad >= 0 && edad <= 120;
        },
        fechaTurno: valor => {
            const fecha = new Date(valor);
            const hoy = new Date();
            const diaSemana = fecha.getDay();
            return fecha > hoy && diaSemana >= 1 && diaSemana <= 5;
        },
        horaTurno: valor => {
            const [hora, minutos] = valor.split(":").map(Number);
            return hora >= 8 && hora < 20;
        },
        textoMinimo: (valor, min) => valor.length >= min
    };

    // Validar formulario al enviar
    form.addEventListener("submit", e => {
        e.preventDefault();
        let esValido = true;

        // Validar campos individuales
        esValido &= validarCampo(document.getElementById("nombre"), reglas.nombre, "Solo letras y espacios.");
        esValido &= validarCampo(document.getElementById("dni"), reglas.dni, "Debe tener 7 u 8 dígitos.");
        esValido &= validarCampo(document.getElementById("email"), reglas.email, "Correo inválido.");
        esValido &= validarCampo(document.getElementById("telefono"), reglas.telefono, "Teléfono inválido.");
        esValido &= validarCampo(document.getElementById("fecha-nacimiento"), reglas.fechaNacimiento, "Fecha inválida.");
        esValido &= validarCampo(document.getElementById("fecha-turno"), reglas.fechaTurno, "Debe ser un día hábil con 24h de anticipación.");
        esValido &= validarCampo(document.getElementById("hora-turno"), reglas.horaTurno, "Debe estar entre 08:00 y 20:00.");
        esValido &= validarCampo(document.getElementById("motivo-consulta"), valor => reglas.textoMinimo(valor, 20), "Mínimo 20 caracteres.");

        // Si el formulario es válido, mostrar confirmación
        if (esValido) {
            const turnoId = `TURN-${Math.floor(Math.random() * 100000)}`;
            alert(`Turno confirmado: ${turnoId}`);
            form.reset();
        } else {
            const primerError = document.querySelector(".campo-error");
            if (primerError) primerError.scrollIntoView({ behavior: "smooth" });
        }
    });
});
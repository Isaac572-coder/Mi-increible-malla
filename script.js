document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los elementos con la clase 'course'
    const courses = document.querySelectorAll('.course');
    // Clave para almacenar los datos en localStorage
    const STORAGE_KEY = 'approvedCourses';

    /**
     * Carga el estado de los ramos y sus promedios desde localStorage.
     * Aplica la clase 'approved' y muestra el promedio si existen datos.
     */
    const loadCourseStates = () => {
        // Obtiene la cadena JSON de localStorage
        const storedCourses = localStorage.getItem(STORAGE_KEY);
        // Si hay datos, los parsea a un objeto JavaScript
        if (storedCourses) {
            const approvedCourses = JSON.parse(storedCourses);

            // Itera sobre cada ramo en la página
            courses.forEach(course => {
                const courseName = course.dataset.course; // Obtiene el nombre del ramo desde el atributo data-course
                // Si el ramo está en los datos guardados
                if (approvedCourses[courseName]) {
                    course.classList.add('approved'); // Agrega la clase 'approved'
                    // Si hay un promedio guardado, lo muestra
                    if (approvedCourses[courseName].grade) {
                        displayGrade(course, approvedCourses[courseName].grade);
                    }
                }
            });
        }
    };

    /**
     * Guarda el estado actual de los ramos aprobados y sus promedios en localStorage.
     */
    const saveCourseStates = () => {
        const approvedCourses = {};
        // Itera sobre todos los ramos para construir el objeto a guardar
        courses.forEach(course => {
            const courseName = course.dataset.course;
            if (course.classList.contains('approved')) {
                // Si el ramo está aprobado, guarda su estado
                approvedCourses[courseName] = { approved: true };
                // Si tiene un promedio, también lo guarda
                const gradeElement = course.querySelector('.grade');
                if (gradeElement) {
                    approvedCourses[courseName].grade = gradeElement.textContent;
                }
            }
        });
        // Guarda el objeto como una cadena JSON en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(approvedCourses));
    };

    /**
     * Muestra el promedio en la esquina superior derecha del ramo.
     * @param {HTMLElement} courseElement - El elemento del DOM del ramo.
     * @param {string} grade - El promedio a mostrar.
     */
    const displayGrade = (courseElement, grade) => {
        let gradeSpan = courseElement.querySelector('.grade');
        if (!gradeSpan) {
            // Si no existe el elemento del promedio, lo crea
            gradeSpan = document.createElement('span');
            gradeSpan.classList.add('grade');
            courseElement.appendChild(gradeSpan);
        }
        gradeSpan.textContent = grade; // Asigna el texto del promedio
    };

    /**
     * Manejador de eventos para el clic en un ramo.
     * Alterna el estado de 'aprobado' y solicita/muestra el promedio.
     * @param {Event} event - El evento de clic.
     */
    const handleCourseClick = (event) => {
        const course = event.currentTarget; // El ramo en el que se hizo clic

        // Si el ramo ya está aprobado, al hacer clic, se desaprueba.
        if (course.classList.contains('approved')) {
            course.classList.remove('approved'); // Remueve la clase 'approved'
            const gradeSpan = course.querySelector('.grade');
            if (gradeSpan) {
                gradeSpan.remove(); // Elimina el promedio si existe
            }
        } else {
            // Si el ramo no está aprobado, lo marca como aprobado
            course.classList.add('approved');

            // Pide al usuario que ingrese el promedio
            let grade = prompt(`¡Felicidades! Has aprobado ${course.dataset.course}. Ingresa tu promedio final:`);

            // Valida el promedio ingresado
            if (grade !== null && grade.trim() !== '') {
                // Asegura que sea un número válido y lo formatea a un decimal si es necesario
                grade = parseFloat(grade).toFixed(1);
                if (isNaN(grade)) {
                    alert('Por favor, ingresa un número válido para el promedio.');
                    // Si no es válido, lo desmarca como aprobado y sale
                    course.classList.remove('approved');
                    saveCourseStates(); // Guarda el estado (sin promedio)
                    return;
                }
                displayGrade(course, grade); // Muestra el promedio
            } else {
                // Si el usuario cancela o no ingresa nada, lo desmarca como aprobado
                course.classList.remove('approved');
            }
        }
        saveCourseStates(); // Guarda el estado actualizado en localStorage
    };

    // Agrega el event listener a cada ramo
    courses.forEach(course => {
        course.addEventListener('click', handleCourseClick);
    });

    // Carga los estados de los ramos al cargar la página
    loadCourseStates();
});

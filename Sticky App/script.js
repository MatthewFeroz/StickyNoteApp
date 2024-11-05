function addStickyNote(quadrantId) {
    const note = document.createElement('div');
    note.classList.add('sticky-note');
    note.contentEditable = true;
    note.innerText = "New Note";

    note.style.position = 'absolute';
    note.style.top = `${Math.random() * 80}%`;
    note.style.left = `${Math.random() * 80}%`;

// Allow dragging
    note.onmousedown = function (event) {
        let shiftX = event.clientX - note.getBoundingClientRect().left;
        let shiftY = event.clientY - note.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            note.style.left = pageX - shiftX +'px';
            note.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        note.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            note.onmouseup = null;
        };
    };

    note.ondragstart= function () {
    return false;
    };

    document.getElementById(quadrantId).appendChild(note);
}

document.addEventListener('DOMContentLoaded', loadNotes);

function saveNotesState(){
    const quadrants = document.querySelectorAll('.quadrant');
    const notesData = [];

    quadrants.forEach(quadrant => {
        const notes = quadrant.querySelectorAll('.sticky-note');
        notes.forEach(note=> {
            notesData.push({
                quadrantId: quadrant.id,
                content: note.innerText,
                position: {
                    top: note.style.top,
                    left: note.style.left
                }
            });
        });
    });

    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
        savedNotes.forEach(noteData =>{
            const note = document.createElement('div');
            note.classList.add('sticky-note');
            note.contentEditable = true;
            note.innerText = noteData.content;

            note.style.position = 'absolute';
            note.style.top = noteData.position.top;
            note.style.left = noteData.position.left;
            
            //allow dragging
            note.onmousedown = function (event) {
                let shiftX = event.clientX - note.getBoundingClientRect().left;
                let shiftY = event.clientY - note.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    note.style.left = pageX-shiftX +'px';
                    note.style.top = pageY-shiftY +'px';
                }
                
                function onMouseMove(event){
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener('mousemove', onMouseMove);

                note.onmouseup = function(){
                    document.removeEventListener('mousemove', onMouseMove);
                    note.onmouseup = null;
                    saveNotesState();
                };

            };

        note.ondragstart = function () {
            return false;
        };
        

        document.getElementById(noteData.quadrantID).appendChild(note);
        });
    }
}
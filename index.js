class LPDF {
    constructor(id) {
        this.id = id;
        let location = import.meta.url.split('/');
        location.pop();
        this.location = location.join('/') + '/';
        let scriptModule = document.createElement('script');
        scriptModule.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.js';
        document.getElementsByTagName('head')[0].appendChild(scriptModule);
        setInterval(() => {
            if (typeof pdfjsLib === 'undefined') {
                throw 'Impossible d\'utiliser le module LPDF : PDF.js not set on meta';
            }
        }, 1000);
        let renderPDF = document.createElement('div');
        renderPDF.classList.add('dialog-lpdf');
        renderPDF.innerHTML = `<div class="content-lpdf">
            <div class="body-lpdf"></div>
            <div class="footer-lpdf">
                <div class="buttons-right">
                    <button id="closeLPDF" class="btn-lpdf">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="buttons-navigation">
                    <button id="PreviousPage" class="btn-lpdf">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div class="input-group-lpdf">
                        <input class="form-control-lpdf" type="number" name="currentPage" id="currentPage" min="1" value="1" aria-label="currentPage" onload="this.value=1" />
                        <span class="input-group-text-lpdf" >/<span id="numberPage">0</span></span>
                    </div>
                    <button id="NextPage" class="btn-lpdf">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>`;
        document.getElementById(id).append(renderPDF);
        document.getElementById(id).classList.add('lpdf', 'fade');

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let styleModule = document.createElement('style');
                    styleModule.innerHTML = this.responseText;
                    document.getElementsByTagName('head')[0].appendChild(styleModule);
                }
            }
        };
        xhr.open('GET', this.location + '/css/main.min.css');
        xhr.send();

        document.getElementById(id).querySelector('input').addEventListener('change', () => {
            document.getElementById(id).querySelector('canvas#page' + CSS.escape(document.getElementById(id).querySelector('input').value)).scrollIntoView();
        });

        document.getElementById(id).querySelectorAll('#PreviousPage,#NextPage').forEach(button => {
            button.addEventListener('click', () => {
                let input = document.getElementById(id).querySelector('input'),
                    value = parseInt(input.value);
                input.value = (value + (button.id == 'NextPage' ? (value != document.getElementById(id).querySelectorAll('canvas').length ? 1 : 0) : (value != 1 ? -1 : 0))).toString();
                document.getElementById(id).querySelector('canvas#page' + CSS.escape(input.value)).scrollIntoView();
            });
        });

        document.getElementById(id).querySelector('.buttons-right > #closeLPDF').addEventListener('click', () => {
            this.close(id);
        });

        document.getElementById(id).querySelector('.body-lpdf').addEventListener('scroll', () => {
            let input = document.getElementById(id).querySelector('#currentPage'),
                boundingClientRect = document.getElementById(id).querySelector('canvas#page' + CSS.escape(input.value)).getBoundingClientRect(),
                valueBottom = boundingClientRect.bottom,
                valueTop = boundingClientRect.top;
            if (valueBottom > (boundingClientRect.height + (window.innerHeight / 2)) && valueTop > (window.innerHeight / 2)) {
                input.value = parseInt(input.value) - 1;
            } else if (valueBottom < (window.innerHeight / 2) && valueTop < -(window.innerHeight / 2)) {
                input.value = parseInt(input.value) + 1;
            }
        });
    }

    renderPDF(documentPDF) {
        let lpdf = document.getElementById(this.id);
        if (this.lazyLoad != documentPDF) {
            this.lazyLoad = documentPDF;
            lpdf.querySelectorAll('canvas').forEach(el => el.remove());
            if (pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.js';
            }
            let loadingTask = pdfjsLib.getDocument(documentPDF);
            loadingTask.promise.then(function (pdf) {
                lpdf.querySelector('#numberPage').textContent = pdf.numPages;
                lpdf.querySelector('input').value = '1';
                lpdf.querySelector('input').max = pdf.numPages;
                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    pdf.getPage(pageNumber).then(function (page) {
                        let scale = 1.5,
                            viewport = page.getViewport({ scale: scale }),
                            canvas = document.createElement('canvas');
                        canvas.id = `page${pageNumber}`;
                        lpdf.querySelector('.body-lpdf').append(canvas);
                        let context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        let renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                }
            }, function (reason) {
                console.error(reason);
            });
        }
    }

    open() {
        let lpdf = document.getElementById(this.id);
        lpdf.style.setProperty('display', 'block');
        lpdf.classList.add('show');
    }

    close() {
        let lpdf = document.getElementById(this.id);
        lpdf.style.setProperty('display', 'none');
        lpdf.classList.remove('show');
    }
}

export default LPDF;
function novoElemento(tagName, className) {
	const elemento = document.createElement(tagName);
	elemento.className = className;
	return elemento;
}

function Barreira(reversa = false) {
	this.elemento = novoElemento('div', 'barreira');

	const borda = novoElemento('div', 'borda');
	const corpo = novoElemento('div', 'corpo');
	this.elemento.appendChild(reversa ? corpo : borda);
	this.elemento.appendChild(reversa ? borda : corpo);

	this.setAltura = altura => (corpo.style.height = `${altura}px`);
}

// const b = new Barreira(true);
// b.setAltura(200);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

function ParDeBarreiras(altura, abertura, posicaoX) {
	this.elemento = novoElemento('div', 'par-de-barreiras');
	this.superior = new Barreira(true);
	this.inferior = new Barreira(false);

	this.elemento.appendChild(this.superior.elemento);
	this.elemento.appendChild(this.inferior.elemento);

	this.sortearAbertura = () => {
		const alturaSuperior = Math.random() * (altura - abertura);
		const alturaInferior = altura - abertura - alturaSuperior;
		this.superior.setAltura(alturaSuperior);
		this.inferior.setAltura(alturaInferior);
	};

	this.getPosicaoX = () => parseInt(this.elemento.style.left.split('px')[0]);

	this.setPosicaoX = posicao => (this.elemento.style.left = `${posicao}px`);

	this.getLargura = () => this.elemento.clientWidth;

	this.sortearAbertura();
	this.setPosicaoX(posicaoX);
}

const b = new ParDeBarreiras(700, 200, 400);
document.querySelector('[wm-flappy]').appendChild(b.elemento);

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

// const b = new ParDeBarreiras(700, 200, 400);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

function Barreiras(altura, largura, abertura, espacoBarreiras, notificarPonto) {
	this.pares = [
		new ParDeBarreiras(altura, abertura, largura),
		new ParDeBarreiras(altura, abertura, largura + espacoBarreiras),
		new ParDeBarreiras(altura, abertura, largura + espacoBarreiras * 2),
		new ParDeBarreiras(altura, abertura, largura + espacoBarreiras * 3),
	];

	const deslocamento = 3;

	this.animar = () => {
		this.pares.forEach(par => {
			par.setPosicaoX(par.getPosicaoX() - deslocamento);

			// quando o elemento sair da área do jogo
			if (par.getPosicaoX() < -par.getLargura()) {
				par.setPosicaoX(par.getPosicaoX() + espacoBarreiras * this.pares.length);
				par.sortearAbertura();
			}

			const meio = largura / 2;
			const cruzouOMeio = par.getPosicaoX() + deslocamento >= meio && par.getPosicaoX() < meio;

			cruzouOMeio && notificarPonto();
		});
	};
}

const barreiras = new Barreiras(700, 1200, 200, 400);
const areaJogo = document.querySelector('[wm-flappy]');
barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento));

setInterval(() => {
	barreiras.animar();
}, 20);

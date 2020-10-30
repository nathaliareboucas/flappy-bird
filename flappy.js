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

function Passaro(alturaJogo) {
	let voando = false;

	this.elemento = novoElemento('img', 'passaro');
	this.elemento.src = 'images/passaro.png';

	this.getPosicaoY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
	this.setPosicaoY = posicaoY => (this.elemento.style.bottom = `${posicaoY}px`);

	window.onkeydown = evento => (voando = true);
	window.onkeyup = evento => (voando = false);

	this.animar = () => {
		const novaPosicaoY = this.getPosicaoY() + (voando ? 8 : -5);
		const alturaMaxima = alturaJogo - this.elemento.clientHeight;

		if (novaPosicaoY <= 0) {
			this.setPosicaoY(0);
		} else if (novaPosicaoY >= alturaMaxima) {
			this.setPosicaoY(alturaMaxima);
		} else {
			this.setPosicaoY(novaPosicaoY);
		}
	};

	this.setPosicaoY(alturaJogo / 2);
}

function Progresso() {
	this.elemento = novoElemento('span', 'progresso');
	this.atualizarPontos = pontos => {
		this.elemento.innerHTML = pontos;
	};

	this.atualizarPontos(0);
}

function estaoSobrepostos(elementoA, elementoB) {
	const a = elementoA.getBoundingClientRect();
	const b = elementoB.getBoundingClientRect();

	const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

	const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

	return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
	let colidiu = false;
	barreiras.pares.forEach(par => {
		if (!colidiu) {
			const superior = par.superior.elemento;
			const inferior = par.inferior.elemento;
			colidiu = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior);
		}
	});
	return colidiu;
}

function removeItensJogo() {
	const areaJogo = document.querySelector('[wm-flappy]');

	const passaro = document.querySelector('.passaro');
	const barreiras = document.querySelectorAll('.par-de-barreiras');
	areaJogo.removeChild(passaro);
	barreiras.forEach(par => areaJogo.removeChild(par));
}

function finalizarJogo() {
	removeItensJogo();

	const btnRestart = document.querySelector('.btn-start');
	btnRestart.innerHTML = 'Restart';
	btnRestart.style.fontSize = '50px';
	btnRestart.style.display = 'block';
}

function temPontuacaoAnterior() {
	const pontuacao = document.querySelector('.progresso');
	return pontuacao !== null;
}

function removePontuacao() {
	const areaJogo = document.querySelector('[wm-flappy]');
	const pontuacao = document.querySelector('.progresso');
	areaJogo.removeChild(pontuacao);
}

function FlappyBird() {
	if (temPontuacaoAnterior()) {
		removePontuacao();
	}

	let pontos = 0;
	const areaDoJogo = document.querySelector('[wm-flappy]');
	const alturaJogo = areaDoJogo.clientHeight;
	const larguraJogo = areaDoJogo.clientWidth;

	const progresso = new Progresso();
	const barreiras = new Barreiras(alturaJogo, larguraJogo, 180, 350, () => {
		progresso.atualizarPontos(++pontos);
	});
	const passaro = new Passaro(alturaJogo);

	areaDoJogo.appendChild(progresso.elemento);
	areaDoJogo.appendChild(passaro.elemento);
	barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));

	this.start = () => {
		const temporizador = setInterval(() => {
			barreiras.animar();
			passaro.animar();

			if (colidiu(passaro, barreiras)) {
				clearInterval(temporizador);
				finalizarJogo();
			}
		}, 20);
	};
}

function iniciar() {
	const btnPlay = document.querySelector('.btn-start');
	btnPlay.style.display = 'none';

	const jogo = new FlappyBird().start();
}

import React from 'react';

function Footer() {
	return (
		<div className="footer">
			<p>Martin H. Olesen | Blog</p>

			<a className="footer__link" href="https://bit.ly/2Zrlxbr" target="_blank" rel="noopener noreferrer">
				Portfolio
			</a>
			<span> • </span>
			<a className="footer__link" href="https://bit.ly/2TtMyrD" target="_blank" rel="noopener noreferrer">
				LinkedIn
			</a>
			<span> • </span>
			<a className="footer__link" href="https://bit.ly/376diCs" target="_blank" rel="noopener noreferrer">
				GitHub
			</a>
			<span> • </span>
			<a className="footer__link" href="https://bit.ly/2NBdt0K" target="_blank" rel="noopener noreferrer">
				CodePen
			</a>

			<p>
				Contact: <a href="mailto:mho.workmail@gmail.com">mho.workmail@gmail.com</a>
			</p>
		</div>
	);
}

export default Footer;

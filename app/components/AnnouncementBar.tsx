import Link from 'next/link';

const AnnouncementBar = () => {
    // Substitua pelo seu número e mensagem personalizada
    const whatsappUrl = "https://wa.me/5569999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20frete%20grátis%20em%20Porto%20Velho.";

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-bar"
        >
            <div className="announcement-bar-content">
                Frete grátis na primeira compra para toda Porto Velho*
                <span className="announcement-bar-link">Saiba mais</span>
            </div>
        </Link>
    );
};

export default AnnouncementBar;
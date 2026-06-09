export default function ImageComponent({ src, alt, className }) {
    return(
        <img
            src={src}
            alt={alt || 'Imagem'}
            className={className}
        />
    )
}
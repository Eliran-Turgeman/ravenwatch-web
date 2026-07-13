const markUrl = `${import.meta.env.BASE_URL}ravenwatch-mark.png`;

export function BrandMark({ className, title, ...props }) {
  return (
    <img
      src={markUrl}
      width="512"
      height="512"
      className={className}
      alt={title ?? ""}
      {...props}
    />
  );
}

export default BrandMark;

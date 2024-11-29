import { useState } from "react";
import { Button, Card, Stack } from "react-bootstrap";
import styles from "../styles/PopupCard.module.css";

type PopupCardProps = {
  icon: React.ReactNode; // SVG icon atau gambar
  title: string; // Judul pada popup
  buttons: { label: string; onClick: () => void }[]; // Konten tombol dalam popup
};

export function PopupCard({ icon, title, buttons }: PopupCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.popupCardContainer}>
      {/* Floating Button */}
      <Button
        className={styles.floatingButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {icon}
      </Button>

      {/* Popup */}
      {isOpen && (
        <Card className={styles.popup}>
          <Card.Body>
            <Card.Title className={styles.title}>{title}</Card.Title>
            <Stack gap={2}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  onClick={button.onClick}
                  variant="primary"
                  className={styles.popupButton}
                >
                  {button.label}
                </Button>
              ))}
            </Stack>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

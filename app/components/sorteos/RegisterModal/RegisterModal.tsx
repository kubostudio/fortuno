"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
    Sparkles,
    Ticket,
    CheckCircle2,
    Copy,
    TriangleAlert,
    AlertCircle,
    X,
    Users,
    ArrowRight,
    ArrowLeft,
    QrCode,
    CreditCard,
    Building2,
    Smartphone,
    MessageCircle,
    Plus,
    Minus,
    Check,
    Lock
} from "lucide-react";
import { Giveaway, Participant } from "@/app/lib/types/giveaway";
import { registerParticipantAction } from "@/app/actions/giveaways";
import styles from "./RegisterModal.module.css";

interface RegisterModalProps {
    giveaway: Giveaway;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (participant: Participant) => void;
    initialReferralCode?: string;
    onOpenBuyTickets?: (participant: Participant) => void;
}

type ModalStep = "form" | "payment" | "success";
type ParticipationMode = "buy" | "referral";
type PaymentMethod = "yape_plin" | "bank_transfer" | "culqi_card";

export default function RegisterModal({
    giveaway,
    isOpen,
    onClose,
    onSuccess,
    initialReferralCode = "",
    onOpenBuyTickets
}: RegisterModalProps) {
    // Current step
    const [step, setStep] = useState<ModalStep>("form");

    // Form inputs
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dni, setDni] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [referralCode, setReferralCode] = useState(initialReferralCode);
    const [acceptTerms, setAcceptTerms] = useState(true);

    // Participation Mode & Tickets
    const [participationMode, setParticipationMode] = useState<ParticipationMode>("buy");
    const [ticketCount, setTicketCount] = useState(1);

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("yape_plin");
    const [copiedPaymentInfo, setCopiedPaymentInfo] = useState<string | null>(null);

    // Loading & Error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Result data
    const [successData, setSuccessData] = useState<{
        participant: Participant;
        isExisting?: boolean;
        message?: string;
    } | null>(null);
    const [copiedReferralLink, setCopiedReferralLink] = useState(false);
    const [copiedTickets, setCopiedTickets] = useState(false);

    useEffect(() => {
        if (initialReferralCode) {
            setReferralCode(initialReferralCode.toUpperCase());
        }
    }, [initialReferralCode]);

    if (!isOpen) return null;

    const ticketPrice = giveaway.ticketPrice || 5;
    const totalAmount = participationMode === "buy" ? ticketCount * ticketPrice : 0;
    const participationsCount = participationMode === "buy" ? ticketCount * 3 : 0;

    function handleTriggerConfetti() {
        try {
            confetti({
                particleCount: 90,
                spread: 80,
                origin: { y: 0.6 }
            });
        } catch {
            // Ignore
        }
    }

    function copyToClipboard(text: string, identifier: string, setter: (val: boolean) => void) {
        navigator.clipboard.writeText(text);
        setCopiedPaymentInfo(identifier);
        setter(true);
        setTimeout(() => {
            setCopiedPaymentInfo(null);
            setter(false);
        }, 2500);
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || fullName.trim().length < 3) {
            setError("Por favor ingresa tu nombre completo.");
            return;
        }

        if (!dni.trim() || dni.trim().length < 5) {
            setError("Por favor ingresa un número de DNI o documento de identidad válido.");
            return;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Por favor ingresa un correo electrónico válido.");
            return;
        }

        if (!phone.trim() || phone.trim().length < 8) {
            setError("Por favor ingresa un número de WhatsApp / Teléfono válido (mínimo 8 dígitos).");
            return;
        }

        if (!birthDate) {
            setError("Por favor ingresa tu fecha de nacimiento.");
            return;
        }

        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (currentYear - birthYear < (giveaway.requirements?.minAge || 18)) {
            setError(`Debes tener al menos ${giveaway.requirements?.minAge || 18} años para participar.`);
            return;
        }

        if (!acceptTerms) {
            setError("Debes aceptar las bases del sorteo y la política de privacidad.");
            return;
        }

        if (participationMode === "buy") {
            if (ticketCount < 1) {
                setError("Debes seleccionar al menos 1 ticket para comprar.");
                return;
            }
            // Transition to payment view
            setStep("payment");
        } else {
            // Referral mode -> register immediately (0 initial tickets)
            executeRegistration(0);
        }
    }

    async function executeRegistration(ticketsToRegister: number) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await registerParticipantAction({
                giveawayId: giveaway.id,
                fullName,
                email,
                phone,
                dni,
                birthDate,
                referralCode: referralCode.trim() || undefined,
                initialTickets: ticketsToRegister
            });

            if (result.success && result.participant) {
                setSuccessData({
                    participant: result.participant,
                    isExisting: result.isExisting,
                    message: result.message
                });
                setStep("success");
                handleTriggerConfetti();
                if (onSuccess) {
                    onSuccess(result.participant);
                }
            } else {
                setError(result.message || "No se pudo procesar el registro.");
                if (step === "payment") {
                    setStep("form");
                }
            }
        } catch (err) {
            setError("Ocurrió un error al procesar el registro.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function handleConfirmPayment() {
        // En simulación dejamos pasar todos los pagos directamente
        executeRegistration(ticketCount);
    }

    function handleCopyReferralLink() {
        if (!successData?.participant) return;
        const origin = typeof window !== "undefined" ? window.location.origin : "https://fortuno.pe";
        const shareUrl = `${origin}/sorteos/${giveaway.slug}?ref=${successData.participant.referralCode}`;
        copyToClipboard(shareUrl, "referral_link", setCopiedReferralLink);
    }

    function handleCopyAllTickets() {
        if (!successData?.participant?.ticketNumbers?.length) return;
        const codesStr = successData.participant.ticketNumbers.join(", ");
        copyToClipboard(codesStr, "tickets_all", setCopiedTickets);
    }

    return (
        <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    <X size={18} />
                </button>

                {/* ========================================================================= */}
                {/* STEP 1: FORM & PARTICIPATION CHOICE                                      */}
                {/* ========================================================================= */}
                {step === "form" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{giveaway.title}</h2>
                            <p className={styles.subtitle}>
                                Completa tus datos para participar y ganar. Elige comprar tickets o participar gratis con referidos.
                            </p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert} role="alert">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className={styles.form}>
                            {/* Personal Data */}
                            <div className={styles.sectionHeading}>
                                <span>1</span> Tus Datos Personales
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="reg-fullname">Nombre completo (según DNI) *</label>
                                <input
                                    id="reg-fullname"
                                    type="text"
                                    placeholder="Ej. Juan Carlos Pérez Rodríguez"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="reg-dni">Documento de identidad *</label>
                                    <input
                                        id="reg-dni"
                                        type="text"
                                        placeholder="Ej. 72918294"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <small className={styles.inputHint}>Si refieres, tu código se vinculará a este documento.</small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="reg-phone">
                                        Teléfono *
                                    </label>
                                    <input
                                        id="reg-phone"
                                        type="tel"
                                        placeholder="Ej. 987654321"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <small className={styles.inputHintHighlight}>
                                        <TriangleAlert size={12}/> Te enviaremos tus tickets a este número.
                                    </small>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="reg-email">Correo electrónico *</label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        placeholder="tu-email@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="reg-birthdate">Fecha de nacimiento *</label>
                                    <input
                                        id="reg-birthdate"
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="reg-refcode">
                                    ¿Tienes un código de amigo? (Opcional)
                                </label>
                                <input
                                    id="reg-refcode"
                                    type="text"
                                    placeholder="Ej. CAR789"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Mode Selection */}
                            <div className={styles.sectionHeading}>
                                <span>2</span> Elige tu forma de participar
                            </div>

                            <div className={styles.modeTabs}>
                                <button
                                    type="button"
                                    className={`${styles.modeTab} ${participationMode === "buy" ? styles.modeTabActive : ""}`}
                                    onClick={() => setParticipationMode("buy")}
                                >
                                    <div className={styles.modeTabHeader}>
                                        <Ticket size={18} />
                                        <strong>Comprar Tickets</strong>
                                        <span className={styles.modeTabBadgePopular}>+ Opciones</span>
                                    </div>
                                    <p className={styles.modeTabDesc}>
                                        1 ticket = <strong>3 participaciones</strong> automáticas en la tómbola.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.modeTab} ${participationMode === "referral" ? styles.modeTabActive : ""}`}
                                    onClick={() => setParticipationMode("referral")}
                                >
                                    <div className={styles.modeTabHeader}>
                                        <Users size={18} />
                                        <strong>Referir Amigos</strong>
                                        <span className={styles.modeTabBadgeFree}>Gratis</span>
                                    </div>
                                    <p className={styles.modeTabDesc}>
                                        Genera tu código y por cada <strong>3 amigos</strong> sumas 1 participación.
                                    </p>
                                </button>
                            </div>

                            {/* Mode details */}
                            {participationMode === "buy" ? (
                                <div className={styles.buyConfigBox}>
                                    <div className={styles.buyConfigHeader}>
                                        <div>
                                            <span className={styles.buyConfigLabel}>Cantidad de tickets:</span>
                                            <div className={styles.buyCalcHint}>
                                                <strong>{participationsCount} participaciones</strong>
                                            </div>
                                        </div>

                                        <div className={styles.quantityControl}>
                                            <button
                                                type="button"
                                                className={styles.qtyBtn}
                                                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                                disabled={ticketCount <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                className={styles.qtyInput}
                                                min="1"
                                                max="100"
                                                value={ticketCount}
                                                onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            />
                                            <button
                                                type="button"
                                                className={styles.qtyBtn}
                                                onClick={() => setTicketCount(ticketCount + 1)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.referralInfoBox}>
                                    <div className={styles.referralInfoIcon}>
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <strong>Participación gratuita mediante referidos</strong>
                                        <p>
                                            Al registrarte se generará tu <b>código único</b> asociado a tu DNI. Comparte tu enlace y por cada 3 amigos que se registren sumarás 1 participación para el sorteo en vivo.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Terms */}
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span>
                                    Acepto las <a href="/terminos" target="_blank" rel="noreferrer">bases del sorteo</a> y la <a href="/privacidad" target="_blank" rel="noreferrer">política de privacidad</a>.
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                            >
                                {participationMode === "buy" ? (
                                    <>
                                        Continuar al Pago • S/. {totalAmount.toFixed(2)} <ArrowRight size={18} />
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        {isLoading ? "Generando registro..." : "Generar mi Código y Registrarme"}
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* ========================================================================= */}
                {/* STEP 2: PAYMENT SECTION (Ready for Culqi / Yape / Plin / Bank)           */}
                {/* ========================================================================= */}
                {step === "payment" && (
                    <div className={styles.paymentSection}>
                        <div className={styles.paymentHeader}>
                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={() => setStep("form")}
                            >
                                <ArrowLeft size={16} /> Volver a mis datos
                            </button>
                            <h2 className={styles.paymentTitle}>Elige tu Medio de Pago</h2>
                            <p className={styles.paymentSubtitle}>
                                Completa el pago para generar y asegurar tus {ticketCount} tickets oficiales.
                            </p>
                        </div>

                        {/* Order Summary Card */}
                        <div className={styles.orderSummaryCard}>
                            <div className={styles.orderSummaryRow}>
                                <span>Sorteo:</span>
                                <strong>{giveaway.title}</strong>
                            </div>
                            <div className={styles.orderSummaryRow}>
                                <span>Cantidad de Tickets:</span>
                                <strong>{ticketCount} ticket{ticketCount > 1 ? "s" : ""} ({participationsCount} participaciones)</strong>
                            </div>
                            <div className={styles.orderSummaryTotal}>
                                <span>Total a Pagar:</span>
                                <em>S/. {totalAmount.toFixed(2)}</em>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className={styles.paymentMethodTabs}>
                            <button
                                type="button"
                                className={`${styles.paymentMethodTab} ${paymentMethod === "yape_plin" ? styles.paymentMethodTabActive : ""}`}
                                onClick={() => setPaymentMethod("yape_plin")}
                            >
                                <Smartphone size={18} />
                                <span>Yape / Plin</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.paymentMethodTab} ${paymentMethod === "bank_transfer" ? styles.paymentMethodTabActive : ""}`}
                                onClick={() => setPaymentMethod("bank_transfer")}
                            >
                                <Building2 size={18} />
                                <span>Transferencia</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.paymentMethodTab} ${paymentMethod === "culqi_card" ? styles.paymentMethodTabActive : ""}`}
                                onClick={() => setPaymentMethod("culqi_card")}
                            >
                                <CreditCard size={18} />
                                <span>Tarjeta (Culqi)</span>
                            </button>
                        </div>

                        {/* Tab Content: Yape / Plin */}
                        {paymentMethod === "yape_plin" && (
                            <div className={styles.paymentBodyBox}>
                                <div className={styles.qrContainer}>
                                    <div className={styles.qrCard}>
                                        <div className={styles.qrBadgeYape}>YAPE & PLIN</div>
                                        {/* Simulated QR Code SVG */}
                                        <div className={styles.qrWrapper}>
                                            <svg viewBox="0 0 100 100" className={styles.qrSvg} aria-label="QR de pago Yape y Plin">
                                                <rect width="100" height="100" fill="#ffffff" rx="8" />
                                                {/* Corner 1 */}
                                                <rect x="10" y="10" width="26" height="26" fill="#1e1b4b" rx="4" />
                                                <rect x="15" y="15" width="16" height="16" fill="#ffffff" rx="2" />
                                                <rect x="19" y="19" width="8" height="8" fill="#7c3aed" rx="1" />
                                                {/* Corner 2 */}
                                                <rect x="64" y="10" width="26" height="26" fill="#1e1b4b" rx="4" />
                                                <rect x="69" y="15" width="16" height="16" fill="#ffffff" rx="2" />
                                                <rect x="73" y="19" width="8" height="8" fill="#7c3aed" rx="1" />
                                                {/* Corner 3 */}
                                                <rect x="10" y="64" width="26" height="26" fill="#1e1b4b" rx="4" />
                                                <rect x="15" y="69" width="16" height="16" fill="#ffffff" rx="2" />
                                                <rect x="19" y="73" width="8" height="8" fill="#7c3aed" rx="1" />
                                                {/* Data patterns */}
                                                <rect x="42" y="12" width="6" height="6" fill="#7c3aed" />
                                                <rect x="52" y="12" width="6" height="6" fill="#06b6d4" />
                                                <rect x="42" y="24" width="6" height="6" fill="#06b6d4" />
                                                <rect x="52" y="24" width="6" height="6" fill="#7c3aed" />
                                                <rect x="42" y="42" width="16" height="16" fill="#1e1b4b" rx="3" />
                                                <rect x="46" y="46" width="8" height="8" fill="#ffffff" rx="1" />
                                                <rect x="14" y="44" width="6" height="6" fill="#7c3aed" />
                                                <rect x="24" y="44" width="6" height="6" fill="#06b6d4" />
                                                <rect x="14" y="54" width="6" height="6" fill="#06b6d4" />
                                                <rect x="24" y="54" width="6" height="6" fill="#7c3aed" />
                                                <rect x="64" y="44" width="6" height="6" fill="#7c3aed" />
                                                <rect x="76" y="44" width="6" height="6" fill="#06b6d4" />
                                                <rect x="64" y="54" width="6" height="6" fill="#06b6d4" />
                                                <rect x="76" y="54" width="6" height="6" fill="#7c3aed" />
                                                <rect x="44" y="66" width="6" height="6" fill="#7c3aed" />
                                                <rect x="54" y="66" width="6" height="6" fill="#06b6d4" />
                                                <rect x="44" y="78" width="6" height="6" fill="#06b6d4" />
                                                <rect x="54" y="78" width="6" height="6" fill="#7c3aed" />
                                                <rect x="66" y="66" width="6" height="6" fill="#1e1b4b" />
                                                <rect x="78" y="66" width="6" height="6" fill="#1e1b4b" />
                                                <rect x="66" y="78" width="18" height="6" fill="#7c3aed" />
                                            </svg>
                                        </div>
                                        <span className={styles.qrScanText}>Escanea con Yape o Plin</span>
                                    </div>

                                    <div className={styles.paymentInfoText}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Número de Celular:</span>
                                            <div className={styles.copyableRow}>
                                                <strong>987 654 321</strong>
                                                <button
                                                    type="button"
                                                    className={styles.inlineCopyBtn}
                                                    onClick={() => copyToClipboard("987654321", "yape_num", () => {})}
                                                >
                                                    {copiedPaymentInfo === "yape_num" ? <Check size={14} /> : <Copy size={14} />}
                                                    {copiedPaymentInfo === "yape_num" ? "Copiado" : "Copiar"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Titular:</span>
                                            <strong>FORTUNO PERU S.A.C.</strong>
                                        </div>

                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Monto Exacto:</span>
                                            <strong className={styles.amountHighlight}>S/. {totalAmount.toFixed(2)}</strong>
                                        </div>

                                        <div className={styles.stepGuide}>
                                            <p>1. Transfiere o yapea el monto exacto.</p>
                                            <p>2. Da clic abajo en <strong>&quot;Ya realicé el pago&quot;</strong> para recibir tus códigos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Bank Transfer */}
                        {paymentMethod === "bank_transfer" && (
                            <div className={styles.paymentBodyBox}>
                                <div className={styles.bankAccountsList}>
                                    <div className={styles.bankAccountItem}>
                                        <div className={styles.bankNameRow}>
                                            <strong>Banco de Crédito (BCP)</strong>
                                            <button
                                                type="button"
                                                className={styles.inlineCopyBtn}
                                                onClick={() => copyToClipboard("193-98765432-0-12", "bcp", () => {})}
                                            >
                                                {copiedPaymentInfo === "bcp" ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedPaymentInfo === "bcp" ? "Copiado" : "Copiar"}
                                            </button>
                                        </div>
                                        <div className={styles.bankDetails}>
                                            <div>Cta Corriente: <code>193-98765432-0-12</code></div>
                                            <div>CCI: <code>002-193009876543201215</code></div>
                                        </div>
                                    </div>

                                    <div className={styles.bankAccountItem}>
                                        <div className={styles.bankNameRow}>
                                            <strong>BBVA Perú</strong>
                                            <button
                                                type="button"
                                                className={styles.inlineCopyBtn}
                                                onClick={() => copyToClipboard("0011-0123-0200987654", "bbva", () => {})}
                                            >
                                                {copiedPaymentInfo === "bbva" ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedPaymentInfo === "bbva" ? "Copiado" : "Copiar"}
                                            </button>
                                        </div>
                                        <div className={styles.bankDetails}>
                                            <div>Cta Corriente: <code>0011-0123-0200987654</code></div>
                                            <div>CCI: <code>011-12300020098765412</code></div>
                                        </div>
                                    </div>

                                    <div className={styles.bankAccountItem}>
                                        <div className={styles.bankNameRow}>
                                            <strong>Interbank</strong>
                                            <button
                                                type="button"
                                                className={styles.inlineCopyBtn}
                                                onClick={() => copyToClipboard("200-3001234567", "ibk", () => {})}
                                            >
                                                {copiedPaymentInfo === "ibk" ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedPaymentInfo === "ibk" ? "Copiado" : "Copiar"}
                                            </button>
                                        </div>
                                        <div className={styles.bankDetails}>
                                            <div>Cta Corriente: <code>200-3001234567</code></div>
                                            <div>CCI: <code>003-20000300123456789</code></div>
                                        </div>
                                    </div>

                                    <div className={styles.titularRow}>
                                        <span>Titular: <strong>FORTUNO PERU S.A.C.</strong></span>
                                        <span>RUC: <strong>20609876543</strong></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Culqi Card */}
                        {paymentMethod === "culqi_card" && (
                            <div className={styles.paymentBodyBox}>
                                <div className={styles.culqiBox}>
                                    <div className={styles.culqiBadges}>
                                        <span className={styles.cardBadge}>VISA</span>
                                        <span className={styles.cardBadge}>Mastercard</span>
                                        <span className={styles.cardBadge}>Amex</span>
                                        <span className={styles.cardBadge}>Diners</span>
                                    </div>
                                    <p className={styles.culqiDesc}>
                                        Integración segura mediante la pasarela de pagos <strong>Culqi</strong>. Encriptación SSL de nivel bancario.
                                    </p>
                                    <div className={styles.culqiNotice}>
                                        <Lock size={14} /> Modo demostración activo. Al confirmar se simulará la aprobación inmediata del pago.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className={styles.paymentActions}>
                            <button
                                type="button"
                                className={styles.confirmPaymentBtn}
                                onClick={handleConfirmPayment}
                                disabled={isLoading}
                            >
                                <CheckCircle2 size={18} />
                                {isLoading ? "Verificando pago y emitiendo tickets..." : "Ya realicé el pago / Confirmar"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* STEP 3: SUCCESS CONFIRMATION & TICKET CODES                               */}
                {/* ========================================================================= */}
                {step === "success" && successData && (
                    <div className={styles.successState}>
                        <div className={styles.successContainer}>
                            <h2 className={styles.successTitle}>
                                <div className={styles.successIconWrapper}>
                                    <CheckCircle2 size={32} className={styles.checkIcon} />
                                </div>
                                <span>{successData.participant.paidTickets > 0 ? "Pago completado!" : "Registro Completado!"}</span>
                            </h2>
                            <p className={styles.successMessage}>
                                {successData.participant.paidTickets > 0
                                    ? "Tus tickets han sido generados y asignados oficialmente a tu documento."
                                    : "Tu código de referido ha sido creado exitosamente."}
                            </p>
                        </div>

                        {/* Participant Summary Card */}
                        <div className={styles.ticketSummaryCard}>
                            <div className={styles.ticketHeader}>
                                <span>Datos del Participante</span>
                            </div>
                            
                            <div className={styles.ticketBody}>
                                <div className={styles.ticketDetails}>
                                    <div className={styles.participantName}><strong>{successData.participant.fullName}</strong></div>
                                    {successData.participant.dni.slice(0, 4)}****
                                    {successData.participant.phone && <div>Teléfono: {successData.participant.phone}</div>}
                                </div>
                                
                                {successData.participant.paidTickets > 0 && (
                                    <div className={styles.ticketStat}>
                                        <span className={styles.statNumber}>{successData.participant.paidTickets} {successData.participant.paidTickets === 1 ? "Ticket" : "Tickets"}</span>
                                        <span className={styles.statLabel}>{successData.participant.totalParticipations} Participaciones</span>
                                    </div>
                                )}
                            </div>

                            {successData.participant.paidTickets > 0 && (
                                <>
                                    <span>
                                        <hr />
                                    </span>

                                    <div className={styles.ticketHeader}>
                                        <span>Información de tus tickets</span>
                                    </div>
                                
                                    {/* Assigned Ticket Codes Card (If bought tickets) */}
                                    {successData.participant.ticketNumbers && successData.participant.ticketNumbers.length > 0 && (
                                        <div className={styles.ticketCodes}>
                                            <div className={styles.ticketCodesGrid}>
                                                <div className={styles.ticketCodesContainer}>
                                                    {successData.participant.ticketNumbers.map((code) => (
                                                        <div key={code} className={styles.ticketCodePill}>
                                                            {code}
                                                        </div>
                                                    ))}
                                                </div>
        
                                                <button
                                                    type="button"
                                                    className={styles.copyCodesBtn}
                                                    onClick={handleCopyAllTickets}
                                                >
                                                    {copiedTickets ? <Check size={14} /> : <Copy size={14} />}
                                                    {copiedTickets ? "¡Copiados!" : "Copiar todos"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {successData.participant.paidTickets < 1 && <br />}
                        
                            {/* WhatsApp Notification Banner */}
                            <div className={styles.whatsappAlertBox}>
                                <div className={styles.whatsappText}>
                                    <strong>{successData.participant.paidTickets > 1 ? "Códigos enviados por WhatsApp" : "Código enviado por WhatsApp"}</strong>
                                    <p>
                                        Hemos enviado la confirmación y tus datos de participación al número registrado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Referral Share Box */}
                        <div className={styles.referralShareBox}>
                            <div className={styles.refTitleRow}>
                                <Users size={18} />
                                <h3>Suma más participaciones gratis</h3>
                            </div>
                            <p>
                                Comparte tu enlace personal. Por cada <strong>3 amigos</strong> que se registren con tu código, obtendrás <strong>1 participación extra</strong>.
                            </p>

                            <div className={styles.codeRow}>
                                <div className={styles.codeBox}>
                                    <span>Tu código:</span>
                                    <strong>{successData.participant.referralCode}</strong>
                                </div>
                                <button
                                    type="button"
                                    className={styles.copyBtn}
                                    onClick={handleCopyReferralLink}
                                >
                                    {copiedReferralLink ? <Check size={15} /> : <Copy size={15} />}
                                    {copiedReferralLink ? "¡Copiado!" : "Copiar Enlace"}
                                </button>
                            </div>
                        </div>

                        {/* Success Actions */}
                        <div className={styles.successActions}>
                            <button
                                type="button"
                                className={styles.primaryActionBtn}
                                onClick={onClose}
                            >
                                Ver mis datos en el Sorteo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Users,
    Ticket,
    DollarSign,
    Trash2,
    Edit3,
    Calendar,
    ChevronRight,
    CheckCircle2,
    BarChart2,
    Eye,
    EyeOff,
    X,
    Monitor,
    Hash,
    ShieldAlert,
    Lock,
    LogOut
} from "lucide-react";
import { Giveaway, GiveawayStatus, Participant } from "@/app/lib/types/giveaway";
import {
    getGiveawaysAction,
    getGiveawayParticipantsAction,
    createGiveawayAction,
    updateGiveawayAction,
    deleteGiveawayAction
} from "@/app/actions/giveaways";
import { toLocalDatetimeInputString, toUTCISOString, formatFriendlyDateTime } from "@/app/lib/utils/date";
import styles from "./page.module.css";

export default function AdminSorteosPage() {
    // 1. Verificación de Localhost
    const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);

    // 2. Autenticación Admin
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // 3. Sorteos & Participantes
    const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
    const [selectedGiveawayId, setSelectedGiveawayId] = useState<string | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGiveaway, setEditingGiveaway] = useState<Giveaway | null>(null);
    const [showSensitive, setShowSensitive] = useState(false);
    const [showCupos, setShowCupos] = useState(false);

    // 4. Modal de confirmación de eliminación con texto obligatorio
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [giveawayToDelete, setGiveawayToDelete] = useState<Giveaway | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    // Form fields para crear/editar sorteo
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [prizeName, setPrizeName] = useState("");
    const [prizeImage, setPrizeImage] = useState("");
    const [prizeValue, setPrizeValue] = useState("");
    const [ticketPrice, setTicketPrice] = useState(5);
    const [currency, setCurrency] = useState("USD");
    const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
    const [maxTickets, setMaxTickets] = useState<number | undefined>(undefined);
    const [endDate, setEndDate] = useState("2026-09-30T23:59");
    const [drawDate, setDrawDate] = useState("2026-10-01T20:00");
    const [status, setStatus] = useState<GiveawayStatus>("active");

    useEffect(() => {
        const host = typeof window !== "undefined" ? window.location.hostname : "";
        const isLocal = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
        setIsLocalhost(isLocal);

        if (typeof window !== "undefined" && sessionStorage.getItem("fortuno_admin_auth") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadGiveaways();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (selectedGiveawayId && isAuthenticated) {
            let active = true;
            getGiveawayParticipantsAction(selectedGiveawayId).then((data) => {
                if (active) setParticipants(data);
            });
            return () => {
                active = false;
            };
        } else {
            setParticipants([]);
        }
    }, [selectedGiveawayId, isAuthenticated]);

    // Cerrar modal con ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
                closeDeleteModal();
            }
        };
        if (isModalOpen || isDeleteModalOpen) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isModalOpen, isDeleteModalOpen]);

    async function loadGiveaways() {
        const list = await getGiveawaysAction();
        setGiveaways([...list]);
        if (list.length > 0 && !selectedGiveawayId) {
            setSelectedGiveawayId(list[0].id);
        }
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if ((loginUsername === "adminFortuno" || loginUsername === "admin") && loginPassword === "admin123") {
            setIsAuthenticated(true);
            setLoginError("");
            sessionStorage.setItem("fortuno_admin_auth", "true");
        } else {
            setLoginError("Usuario o contraseña incorrectos.");
        }
    }

    function handleLogout() {
        setIsAuthenticated(false);
        sessionStorage.removeItem("fortuno_admin_auth");
        setLoginUsername("");
        setLoginPassword("");
    }

    const selectedGiveaway = giveaways.find((g) => g.id === selectedGiveawayId);

    // Helper para obtener tickets y personas de cada sorteo (reactivo al sorteo seleccionado cargado)
    const getGiveawayLiveStats = (g: Giveaway) => {
        const isSelected = g.id === selectedGiveawayId;
        const liveTickets = (isSelected && participants.length > 0)
            ? participants.reduce((acc, p) => acc + Math.max(p.paidTickets || 0, p.ticketNumbers ? p.ticketNumbers.length : 0), 0)
            : g.ticketsSold;
        const livePersonas = (isSelected && participants.length > 0)
            ? participants.length
            : g.totalParticipantsCount;
        return { tickets: liveTickets, personas: livePersonas };
    };

    // Métricas globales
    const totalRevenue = giveaways.reduce((acc, g) => {
        const { tickets } = getGiveawayLiveStats(g);
        return acc + (tickets * g.ticketPrice);
    }, 0);
    const totalTicketsSold = giveaways.reduce((acc, g) => {
        const { tickets } = getGiveawayLiveStats(g);
        return acc + tickets;
    }, 0);
    const totalPersonas = giveaways.reduce((acc, g) => {
        const { personas } = getGiveawayLiveStats(g);
        return acc + personas;
    }, 0);

    // Métricas del sorteo seleccionado
    const selectedStats = selectedGiveaway ? getGiveawayLiveStats(selectedGiveaway) : { tickets: 0, personas: 0 };
    const totalTicketsSelected = selectedStats.tickets;
    const totalPersonasSelected = selectedStats.personas;
    const totalParticipaciones = participants.reduce((acc, p) => acc + p.totalParticipations, 0);

    function resetForm() {
        setTitle(""); setSubtitle(""); setDescription("");
        setPrizeName(""); setPrizeImage(""); setPrizeValue("");
        setTicketPrice(5); setCurrency("USD");
        setMaxParticipants(undefined); setMaxTickets(undefined);
        setStatus("active");
    }

    function openNew() {
        resetForm();
        setEditingGiveaway(null);
        setIsModalOpen(true);
    }

    function openEdit(g: Giveaway) {
        setEditingGiveaway(g);
        setTitle(g.title); setSubtitle(g.subtitle); setDescription(g.description);
        setPrizeName(g.prize.name); setPrizeImage(g.prize.image); setPrizeValue(g.prize.value || "");
        setTicketPrice(g.ticketPrice); setCurrency(g.currency);
        setMaxParticipants(g.maxParticipants); setMaxTickets(g.maxTickets);
        setEndDate(toLocalDatetimeInputString(g.endDate));
        setDrawDate(toLocalDatetimeInputString(g.drawDate));
        setStatus(g.status);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingGiveaway(null);
        resetForm();
    }

    function openDeleteModal(g: Giveaway) {
        setGiveawayToDelete(g);
        setDeleteConfirmText("");
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
        setGiveawayToDelete(null);
        setDeleteConfirmText("");
    }

    async function handleConfirmDelete() {
        if (!giveawayToDelete || deleteConfirmText.trim() !== "Borrar sorteo") return;
        await deleteGiveawayAction(giveawayToDelete.id);
        if (selectedGiveawayId === giveawayToDelete.id) {
            setSelectedGiveawayId(null);
        }
        closeDeleteModal();
        await loadGiveaways();
    }

    async function handleSaveGiveaway(e: React.FormEvent) {
        e.preventDefault();
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const utcEnd = toUTCISOString(endDate);
        const utcDraw = toUTCISOString(drawDate);

        if (editingGiveaway) {
            await updateGiveawayAction(editingGiveaway.id, {
                title,
                subtitle,
                description,
                slug,
                ticket_price: ticketPrice,
                currency,
                max_participants: maxParticipants || null,
                max_tickets: maxTickets || null,
                status,
                prize_name: prizeName,
                prize_image: prizeImage || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
                prize_value: prizeValue,
                end_date: utcEnd,
                draw_date: utcDraw
            });
        } else {
            await createGiveawayAction({
                slug,
                title,
                subtitle,
                description,
                ticketPrice,
                currency,
                maxParticipants,
                maxTickets,
                status,
                startDate: new Date().toISOString(),
                endDate: utcEnd,
                drawDate: utcDraw,
                prizeName,
                prizeImage: prizeImage || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
                prizeValue,
                prizeDetails: ["Envío asegurado incluido"]
            });
        }
        closeModal();
        await loadGiveaways();
    }

    const statusLabel: Record<GiveawayStatus, string> = {
        active: "Activo",
        upcoming: "Próximamente",
        paused: "Pausado",
        completed: "Finalizado"
    };

    function maskDni(dni: string) {
        if (dni.length <= 5) return `***${dni}`;
        return `***${dni.slice(-5)}`;
    }

    function maskEmail(email: string) {
        const [user, domain] = email.split("@");
        if (!domain) return email;
        return `${user.slice(0, 2)}***@${domain}`;
    }

    const progress = selectedGiveaway?.maxTickets
        ? Math.min(100, Math.round((totalTicketsSelected / selectedGiveaway.maxTickets) * 100))
        : 0;

    // Si aún no se determinó el host
    if (isLocalhost === null) {
        return null;
    }

    // 1. Bloqueo si NO es localhost
    if (isLocalhost === false) {
        return (
            <main className={styles.deniedContainer}>
                <div className={styles.deniedBox}>
                    <ShieldAlert size={48} className={styles.deniedIcon} />
                    <h2>Acceso Restringido</h2>
                    <p>El panel de administración solo está disponible en el entorno local (localhost).</p>
                </div>
            </main>
        );
    }

    // 2. Bloqueo si NO está autenticado
    if (!isAuthenticated) {
        return (
            <main className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        <div className={styles.loginLogo}>Fortuno</div>
                        <h2 className={styles.modalTitle}>Acceso de Administración</h2>
                        <p className={styles.loginSubtitle}>Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        {loginError && <div className={styles.loginError}>{loginError}</div>}

                        <div className={styles.inputGroup}>
                            <label>Usuario</label>
                            <input
                                type="text"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                placeholder="Ingresa tu usuario"
                                required
                                autoFocus
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.loginBtn}>
                            <Lock size={16} /> Iniciar Sesión
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            {/* Modal Formulario Crear / Editar */}
            {isModalOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={editingGiveaway ? "Editar sorteo" : "Nuevo sorteo"}
                >
                    <div className={styles.modalBox}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>
                                    {editingGiveaway ? "Editar Sorteo" : "Nuevo Sorteo"}
                                </h2>
                                <p className={styles.modalSubtitle}>
                                    {editingGiveaway
                                        ? `Modificando: ${editingGiveaway.title}`
                                        : "Configura los datos del nuevo sorteo antes de publicarlo."}
                                </p>
                            </div>
                            <button
                                type="button"
                                className={styles.modalCloseBtn}
                                onClick={closeModal}
                                aria-label="Cerrar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveGiveaway} className={styles.modalForm}>
                            {/* Información general */}
                            <fieldset className={styles.formFieldset}>
                                <legend className={styles.fieldsetLegend}>Información general</legend>
                                <div className={styles.formRow2}>
                                    <div className={styles.inputGroup}>
                                        <label>Título del Sorteo *</label>
                                        <input type="text" placeholder="Ej. PlayStation 5 Slim + FC 26" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Subtítulo *</label>
                                        <input type="text" placeholder="Breve descripción del premio" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Descripción / Reglas</label>
                                    <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles, condiciones y reglas del sorteo..." />
                                </div>
                            </fieldset>

                            {/* Premio */}
                            <fieldset className={styles.formFieldset}>
                                <legend className={styles.fieldsetLegend}>Premio</legend>
                                <div className={styles.formRow3}>
                                    <div className={styles.inputGroup}>
                                        <label>Nombre del Premio *</label>
                                        <input type="text" placeholder="Ej. PS5 Slim Digital" value={prizeName} onChange={(e) => setPrizeName(e.target.value)} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Valor Comercial</label>
                                        <input type="text" placeholder="Ej. $650 USD" value={prizeValue} onChange={(e) => setPrizeValue(e.target.value)} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>URL de Imagen</label>
                                        <input type="url" placeholder="https://..." value={prizeImage} onChange={(e) => setPrizeImage(e.target.value)} />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Tickets */}
                            <fieldset className={styles.formFieldset}>
                                <legend className={styles.fieldsetLegend}>Tickets y cupos</legend>
                                <div className={styles.formRow3}>
                                    <div className={styles.inputGroup}>
                                        <label>Precio por Ticket ($) *</label>
                                        <input type="number" min={1} value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Límite total de tickets</label>
                                        <input type="number" min={1} placeholder="Sin límite" value={maxTickets || ""} onChange={(e) => setMaxTickets(e.target.value ? Number(e.target.value) : undefined)} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Cupo máx. participantes</label>
                                        <input type="number" min={1} placeholder="Sin límite" value={maxParticipants || ""} onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : undefined)} />
                                        <small>Opcional</small>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Fechas */}
                            <fieldset className={styles.formFieldset}>
                                <legend className={styles.fieldsetLegend}>Fechas y estado</legend>
                                <div className={styles.formRow3}>
                                    <div className={styles.inputGroup}>
                                        <label>Fecha de Cierre *</label>
                                        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Fecha de Sorteo en Vivo *</label>
                                        <input type="datetime-local" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} required />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Estado</label>
                                        <select value={status} onChange={(e) => setStatus(e.target.value as GiveawayStatus)}>
                                            <option value="active">Activo</option>
                                            <option value="upcoming">Próximamente</option>
                                            <option value="paused">Pausado</option>
                                            <option value="completed">Finalizado</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>

                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.saveBtn}>
                                    <CheckCircle2 size={16} />
                                    {editingGiveaway ? "Guardar Cambios" : "Publicar Sorteo"}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Verificación Eliminar Sorteo */}
            {isDeleteModalOpen && giveawayToDelete && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={styles.deleteModalBox}>
                        <div className={styles.deleteModalTitle}>
                            <div className={styles.deleteIconWrapper}>
                                <Trash2 size={16} />
                            </div>
                            <h3 className={styles.deleteModalTitleText}>¿Eliminar este sorteo?</h3>
                        </div>
                            <p className={styles.deleteModalDesc}>
                            Esta acción eliminará de forma permanente el sorteo <strong>&ldquo;{giveawayToDelete.title}&rdquo;</strong> y todos sus datos asociados.
                        </p>
                        <p className={styles.deleteInstruction}>
                            Para confirmar la eliminación, escribe exactamente: <span className={styles.code}>Borrar sorteo</span>
                        </p>
                        <input
                            type="text"
                            className={styles.deleteInput}
                            placeholder=''
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.deleteModalActions}>
                            <button
                                type="button"
                                className={styles.cancelDeleteBtn}
                                onClick={closeDeleteModal}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={styles.confirmDeleteBtn}
                                disabled={deleteConfirmText.trim() !== "Borrar sorteo"}
                                onClick={handleConfirmDelete}
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Gestión de Sorteos</h1>
                    <p className={styles.pageSubtitle}>
                        Administra sorteos, tickets, participaciones y lista de participantes en tiempo real.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button type="button" className={styles.newBtn} onClick={openNew}>
                        <Plus size={16} /> Nuevo Sorteo
                    </button>
                    <button type="button" className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión de admin">
                        <LogOut size={15} /> Salir
                    </button>
                </div>
            </div>

            {/* Stats globales */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                        <DollarSign size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Recaudado total</span>
                        <strong className={styles.statValue}>${totalRevenue.toLocaleString()} USD</strong>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                        <Ticket size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Tickets vendidos</span>
                        <strong className={styles.statValue}>{totalTicketsSold.toLocaleString()}</strong>
                        <small>{(totalTicketsSold * 3).toLocaleString()} part. base</small>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                        <Users size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Personas inscritas</span>
                        <strong className={styles.statValue}>{totalPersonas.toLocaleString()}</strong>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconAmber}`}>
                        <BarChart2 size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Sorteos activos</span>
                        <strong className={styles.statValue}>
                            {giveaways.filter(g => g.status === "active").length}
                        </strong>
                        <small>de {giveaways.length} totales</small>
                    </div>
                </div>
            </div>

            {/* Layout principal */}
            <div className={styles.mainLayout}>
                {/* Lista de sorteos */}
                <aside className={styles.listColumn}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.columnTitle}>
                            Sorteos <span className={styles.countBadge}>{giveaways.length}</span>
                        </h2>
                    </div>
                    <div className={styles.giveawayList}>
                        {giveaways.map((g) => {
                            const sorteoCode = `#${String(g.sorteoNumber).padStart(3, "0")}`;
                            const isSelected = selectedGiveawayId === g.id;
                            const { tickets, personas } = getGiveawayLiveStats(g);
                            const progressPercent = g.maxTickets
                                ? Math.min(100, Math.round((tickets / g.maxTickets) * 100))
                                : g.maxParticipants
                                ? Math.min(100, Math.round((personas / g.maxParticipants) * 100))
                                : 0;

                            return (
                                <div
                                    key={g.id}
                                    className={`${styles.giveawayItem} ${isSelected ? styles.selectedItem : ""}`}
                                    onClick={() => {
                                        if (selectedGiveawayId !== g.id) {
                                            setSelectedGiveawayId(g.id);
                                            setParticipants([]);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && selectedGiveawayId !== g.id) {
                                            setSelectedGiveawayId(g.id);
                                            setParticipants([]);
                                        }
                                    }}
                                >
                                    <div className={styles.itemTop}>
                                        <span className={`${styles.statusDot} ${styles[`dot_${g.status}`]}`} />
                                        <span className={styles.itemStatusText}>{statusLabel[g.status]}</span>
                                        <span className={styles.sorteoCode}>{sorteoCode}</span>
                                    </div>
                                    <h3 className={styles.itemTitle}>{g.title}</h3>
                                    <div className={styles.itemStats}>
                                        <span>{tickets} {tickets === 1 ? "ticket" : "tickets"}</span>
                                        <span>{personas} {personas === 1 ? "persona" : "personas"}</span>
                                    </div>
                                    {(g.maxTickets || g.maxParticipants) ? (
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                        {giveaways.length === 0 && (
                            <div className={styles.emptyList}>
                                <p>No hay sorteos configurados.</p>
                                <button type="button" className={styles.emptyCreateBtn} onClick={openNew}>
                                    <Plus size={14} /> Crear el primero
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Detalle del sorteo seleccionado */}
                <section className={styles.detailColumn}>
                    {selectedGiveaway ? (
                        <>
                            {/* Header */}
                            <div className={styles.detailHeader}>
                                <div className={styles.detailHeaderInfo}>
                                    <div className={styles.detailMeta}>
                                        <span className={`${styles.statusPill} ${styles[selectedGiveaway.status]}`}>
                                            {statusLabel[selectedGiveaway.status]}
                                        </span>
                                        <span className={styles.detailSorteoCode}>
                                            FORT{String(selectedGiveaway.sorteoNumber).padStart(3, "0")}
                                        </span>
                                    </div>
                                    <h2 className={styles.detailTitle}>{selectedGiveaway.title}</h2>
                                    <p className={styles.detailDates}>
                                        <Calendar size={13} />
                                        Sorteo: {formatFriendlyDateTime(selectedGiveaway.drawDate)}
                                    </p>
                                </div>
                                <div className={styles.detailActions}>
                                    <button
                                        type="button"
                                        className={styles.editDetailBtn}
                                        onClick={() => openEdit(selectedGiveaway)}
                                    >
                                        <Edit3 size={14} /> Editar
                                    </button>
                                    <Link href={`/sorteos/${selectedGiveaway.slug}`} className={styles.viewPublicBtn} target="_blank">
                                        Ver pública <ChevronRight size={14} />
                                    </Link>
                                    <Link
                                        href={`/sorteos/${selectedGiveaway.slug}/live`}
                                        className={styles.launchLiveBtn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Monitor size={14} /> Vista de LIVE
                                    </Link>
                                    <button
                                        type="button"
                                        className={styles.deleteDetailBtn}
                                        onClick={() => openDeleteModal(selectedGiveaway)}
                                    >
                                        <Trash2 size={14} /> Borrar sorteo
                                    </button>
                                </div>
                            </div>

                            {/* Métricas unificadas del sorteo seleccionado */}
                            <div className={styles.metricsRow}>
                                <div className={styles.metricCard}>
                                    <Users size={16} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Personas inscritas</span>
                                        <strong className={styles.metricVal}>{totalPersonasSelected}</strong>
                                    </div>
                                </div>
                                <div className={styles.metricCard}>
                                    <Ticket size={16} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Tickets totales</span>
                                        <strong className={styles.metricVal}>{totalTicketsSelected}</strong>
                                    </div>
                                </div>
                                <div className={styles.metricCard}>
                                    <Hash size={16} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Participaciones totales</span>
                                        <strong className={styles.metricVal}>{totalParticipaciones}</strong>
                                    </div>
                                </div>
                                <div className={styles.metricCard}>
                                    <DollarSign size={16} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Recaudado</span>
                                        <strong className={styles.metricVal}>
                                            ${(totalTicketsSelected * selectedGiveaway.ticketPrice).toLocaleString()} USD
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de participantes */}
                            <div className={styles.participantsCard}>
                                <div className={styles.participantsCardHeader}>
                                    <div>
                                        <h3 className={styles.participantsTitle}>
                                            Participantes Registrados
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.toggleSensitiveBtn}
                                        onClick={() => setShowSensitive(!showSensitive)}
                                    >
                                        {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                                        {showSensitive ? "Ocultar" : "Mostrar"} datos
                                    </button>
                                </div>

                                <div className={styles.tableScroll}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Participante</th>
                                                <th>DNI</th>
                                                <th>Tickets</th>
                                                <th>Referidos</th>
                                                <th>Total part.</th>
                                                <th>Números</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participants.map((p, idx) => (
                                                <tr key={p.id}>
                                                    <td className={styles.tdIndex}>{idx + 1}</td>
                                                    <td>
                                                        <div className={styles.participantCell}>
                                                            <strong>
                                                                {showSensitive
                                                                    ? p.fullName
                                                                    : `${p.fullName.split(" ")[0]} ${(p.fullName.split(" ")[1]?.[0] || "")}*.`}
                                                            </strong>
                                                            <small>{showSensitive ? p.email : maskEmail(p.email)}</small>
                                                        </div>
                                                    </td>
                                                    <td className={styles.tdMono}>
                                                        {showSensitive ? p.dni : maskDni(p.dni)}
                                                    </td>
                                                    <td>
                                                        <span className={styles.ticketBadge}>
                                                            {p.paidTickets} <em>({p.paidParticipations})</em>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.refBadge}>
                                                            {p.referralCount} <em>({p.referralParticipations})</em>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong className={styles.totalBadge}>{p.totalParticipations}</strong>
                                                    </td>
                                                    <td className={styles.ticketNumsCell}>
                                                        {p.ticketNumbers && p.ticketNumbers.length > 0 ? (
                                                            <div className={styles.ticketNumList}>
                                                                {p.ticketNumbers.slice(0, 3).map((tn) => (
                                                                    <code key={tn} className={styles.ticketNum}>{tn}</code>
                                                                ))}
                                                                {p.ticketNumbers.length > 3 && (
                                                                    <span className={styles.moreTickets}>+{p.ticketNumbers.length - 3}</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className={styles.noTickets}>—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyDetail}>
                            <div className={styles.emptyDetailIcon}><Users size={32} /></div>
                            <p>Selecciona un sorteo de la lista para ver sus detalles.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}


"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTOS PRINCIPAIS
    // =========================================

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const mobileMenuButton = document.getElementById("mobileMenuButton");

    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModalButton = document.getElementById("closeModal");
    const cancelModalButton = document.getElementById("cancelModal");
    const newJobButton = document.getElementById("newJobButton");
    const newJobForm = document.getElementById("newJobForm");

    const toastMessage = document.getElementById("toastMessage");
    const toastText = document.getElementById("toastText");

    const globalSearch = document.getElementById("globalSearch");
    const searchBox = document.querySelector(".search-box");

    let toastTimeout;
    let previousFocusedElement = null;

    // =========================================
    // ANO ATUAL
    // =========================================

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    // =========================================
    // NOTIFICAÇÃO VISUAL
    // =========================================

    function showToast(message, type = "success") {
        if (!toastMessage || !toastText) return;

        toastText.textContent = message;

        const icon = toastMessage.querySelector("i");

        if (icon) {
            icon.className = type === "error"
                ? "fa-solid fa-circle-exclamation"
                : "fa-solid fa-circle-check";

            icon.style.color = type === "error"
                ? "#ff7588"
                : "#43d6a0";
        }

        toastMessage.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(function () {
            toastMessage.classList.remove("show");
        }, 3200);
    }

    // =========================================
    // MENU MOBILE
    // =========================================

    function openMobileMenu() {
        sidebar.classList.add("mobile-open");
        sidebarOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        sidebar.classList.remove("mobile-open");
        sidebarOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    mobileMenuButton.addEventListener("click", function () {
        if (sidebar.classList.contains("mobile-open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    sidebarOverlay.addEventListener("click", closeMobileMenu);

    // =========================================
    // NAVEGAÇÃO
    // =========================================

    const navItems = document.querySelectorAll(".nav-item[data-page]");
    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

    const pageNames = {
        "dashboard": "Dashboard",
        "vagas": "Vagas",
        "candidatos": "Candidatos",
        "analise-ia": "Análise com IA",
        "entrevistas": "Entrevistas",
        "relatorios": "Relatórios",
        "equipe": "Minha equipe",
        "configuracoes": "Configurações"
    };

    navItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault();

            const page = item.dataset.page;

            navItems.forEach(function (navItem) {
                navItem.classList.remove("active");
            });

            item.classList.add("active");

            if (breadcrumbCurrent) {
                breadcrumbCurrent.textContent =
                    pageNames[page] || "Dashboard";
            }

            closeMobileMenu();

            if (page === "dashboard") {
                document.getElementById("dashboard").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                return;
            }

            const target = document.getElementById(page);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                return;
            }

            showToast(
                "A seção " + (pageNames[page] || page) +
                " ainda precisa ser implementada."
            );
        });
    });

    // Links do card de IA
    document.querySelectorAll(".upgrade-link").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const aiNav = document.querySelector(
                '.nav-item[data-page="analise-ia"]'
            );

            if (aiNav) aiNav.click();
        });
    });

    // =========================================
    // MODAL DE NOVA VAGA
    // =========================================

    function openModal() {
        previousFocusedElement = document.activeElement;

        modalBackdrop.classList.add("open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        setTimeout(function () {
            const firstField = document.getElementById("jobName");
            if (firstField) firstField.focus();
        }, 50);
    }

    function closeModal() {
        modalBackdrop.classList.remove("open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (
            previousFocusedElement &&
            typeof previousFocusedElement.focus === "function"
        ) {
            previousFocusedElement.focus();
        }
    }

    newJobButton.addEventListener("click", openModal);
    closeModalButton.addEventListener("click", closeModal);
    cancelModalButton.addEventListener("click", closeModal);

    modalBackdrop.addEventListener("click", function (event) {
        if (event.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
            closeMobileMenu();
        }
    });

    // =========================================
    // CRIAÇÃO DEMONSTRATIVA DE VAGAS
    // =========================================

    const jobsTableBody = document.getElementById("jobsTableBody");
    const activeJobs = document.getElementById("activeJobs");
    const sidebarJobsCount = document.getElementById("sidebarJobsCount");

    let jobCount = 8;

    newJobForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!newJobForm.reportValidity()) return;

        const jobName = document.getElementById("jobName").value.trim();
        const jobArea = document.getElementById("jobArea").value;
        const jobLocation = document.getElementById("jobLocation").value;
        const jobDescription =
            document.getElementById("jobDescription").value.trim();

        if (!jobName || !jobArea || !jobLocation || !jobDescription) {
            showToast("Preencha todos os campos obrigatórios.", "error");
            return;
        }

        const row = document.createElement("tr");
        row.dataset.search =
            (jobName + " " + jobArea + " " + jobLocation).toLowerCase();

        const firstCell = document.createElement("td");
        const titleWrapper = document.createElement("div");
        titleWrapper.className = "job-title-cell";

        const icon = document.createElement("span");
        icon.className = "job-icon job-purple";

        const iconElement = document.createElement("i");
        iconElement.className = "fa-solid fa-briefcase";
        icon.appendChild(iconElement);

        const titleInfo = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = jobName;

        const subtitle = document.createElement("small");
        subtitle.textContent = jobArea + " · " + jobLocation;

        titleInfo.append(title, subtitle);
        titleWrapper.append(icon, titleInfo);
        firstCell.appendChild(titleWrapper);

        const candidatesCell = document.createElement("td");
        const candidatesValue = document.createElement("strong");
        candidatesValue.textContent = "0";
        candidatesCell.appendChild(candidatesValue);

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "job-status status-active";
        status.textContent = "Em andamento";
        statusCell.appendChild(status);

        const progressCell = document.createElement("td");
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "progress-cell";

        const progressTrack = document.createElement("div");
        progressTrack.className = "progress-track";

        const progressBar = document.createElement("span");
        progressBar.style.width = "0%";
        progressTrack.appendChild(progressBar);

        const progressLabel = document.createElement("small");
        progressLabel.textContent = "0%";

        progressWrapper.append(progressTrack, progressLabel);
        progressCell.appendChild(progressWrapper);

        const actionCell = document.createElement("td");
        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "row-action";
        actionButton.setAttribute("aria-label", "Detalhes da vaga");

        const actionIcon = document.createElement("i");
        actionIcon.className = "fa-solid fa-ellipsis";
        actionButton.appendChild(actionIcon);

        actionButton.addEventListener("click", function () {
            showToast(
                "Vaga: " + jobName +
                ". A integração com o cadastro completo ainda precisa ser feita."
            );
        });

        actionCell.appendChild(actionButton);

        row.append(
            firstCell,
            candidatesCell,
            statusCell,
            progressCell,
            actionCell
        );

        jobsTableBody.prepend(row);

        jobCount++;

        activeJobs.textContent = String(jobCount).padStart(2, "0");
        sidebarJobsCount.textContent = jobCount;

        newJobForm.reset();
        closeModal();

        showToast(
            "Vaga adicionada à demonstração. Para salvá-la permanentemente, conecte o backend."
        );

        applySearch();
    });

    // =========================================
    // PESQUISA NO PAINEL
    // =========================================

    function applySearch() {
        const query = globalSearch.value
            .trim()
            .toLocaleLowerCase("pt-BR");

        const rows = Array.from(
            jobsTableBody.querySelectorAll("tr")
        );

        let visibleRows = 0;

        rows.forEach(function (row) {
            const content = (
                (row.innerText || "") + " " +
                (row.dataset.search || "")
            ).toLocaleLowerCase("pt-BR");

            const matches = !query || content.includes(query);

            row.classList.toggle("search-hidden", !matches);

            if (matches) visibleRows++;
        });

        let emptyState = document.getElementById("searchEmptyState");

        if (query && visibleRows === 0) {
            if (!emptyState) {
                emptyState = document.createElement("div");
                emptyState.id = "searchEmptyState";
                emptyState.className = "empty-state";
                emptyState.innerHTML =
                    '<i class="fa-solid fa-magnifying-glass"></i>' +
                    'Nenhuma vaga encontrada para esta pesquisa.';

                const tableWrapper = jobsTableBody.closest(".table-responsive");
                tableWrapper.appendChild(emptyState);
            }

            emptyState.style.display = "block";
        } else if (emptyState) {
            emptyState.style.display = "none";
        }
    }

    globalSearch.addEventListener("input", applySearch);

    // Atalho Ctrl + K / Command + K
    document.addEventListener("keydown", function (event) {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();

            if (window.innerWidth <= 600) {
                searchBox.classList.add("search-open");
            }

            globalSearch.focus();
        }
    });

    globalSearch.addEventListener("blur", function () {
        if (window.innerWidth <= 600 && !globalSearch.value) {
            searchBox.classList.remove("search-open");
        }
    });

    // =========================================
    // NOTIFICAÇÕES
    // =========================================

    const notificationButton = document.getElementById("notificationButton");

    notificationButton.addEventListener("click", function () {
        const dot = notificationButton.querySelector(".notification-dot");

        if (dot) {
            dot.remove();
            showToast("Notificações recentes marcadas como lidas.");
        } else {
            showToast("Você não tem novas notificações.");
        }
    });

    // =========================================
    // PERFIL
    // =========================================

    document.getElementById("profileButton").addEventListener("click", function () {
        showToast("O gerenciamento de perfil será integrado posteriormente.");
    });

    document.getElementById("topbarProfile").addEventListener("click", function () {
        showToast("O gerenciamento de perfil será integrado posteriormente.");
    });

    // =========================================
    // EXPORTAÇÃO CSV
    // =========================================

    document.getElementById("exportButton").addEventListener("click", function () {
        const rows = Array.from(
            jobsTableBody.querySelectorAll("tr")
        ).filter(function (row) {
            return !row.classList.contains("search-hidden");
        });

        if (rows.length === 0) {
            showToast("Não há vagas para exportar.", "error");
            return;
        }

        const csvRows = [
            ["Vaga", "Área e modalidade", "Candidatos", "Status", "Progresso"]
        ];

        rows.forEach(function (row) {
            const cells = row.querySelectorAll("td");

            if (cells.length < 5) return;

            const title = cells[0].querySelector("strong");
            const subtitle = cells[0].querySelector("small");
            const candidates = cells[1].innerText.trim();
            const status = cells[2].innerText.trim();
            const progress = cells[3].innerText.trim();

            csvRows.push([
                title ? title.innerText.trim() : "",
                subtitle ? subtitle.innerText.trim() : "",
                candidates,
                status,
                progress
            ]);
        });

        function escapeCSV(value) {
            return '"' + String(value).replace(/"/g, '""') + '"';
        }

        const csvContent = "\uFEFF" + csvRows
            .map(function (row) {
                return row.map(escapeCSV).join(";");
            })
            .join("\r\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = "seletria-relatorio-vagas.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        URL.revokeObjectURL(url);

        showToast("Relatório CSV exportado com sucesso.");
    });

    // =========================================
    // NAVEGAÇÃO PARA VAGAS
    // =========================================

    document.getElementById("viewAllJobs").addEventListener("click", function () {
        document.getElementById("vagas").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        globalSearch.focus();
    });

    document.getElementById("viewActivities").addEventListener("click", function () {
        showToast("Você está visualizando as atividades recentes disponíveis.");
    });

    // =========================================
    // PERÍODO DO GRÁFICO
    // =========================================

    const chartPeriod = document.getElementById("chartPeriod");

    const chartData = {
        "7": {
            candidate: [155, 130, 145, 90, 108, 62, 74, 29, 45],
            interview: [184, 167, 174, 151, 161, 132, 141, 115, 125],
            labels: ["06 Out", "07 Out", "08 Out", "09 Out", "10 Out", "11 Out", "12 Out"]
        },
        "30": {
            candidate: [165, 140, 150, 105, 120, 75, 90, 38, 55],
            interview: [190, 175, 185, 160, 170, 135, 150, 125, 135],
            labels: ["13 Set", "18 Set", "23 Set", "28 Set", "03 Out", "08 Out", "12 Out"]
        },
        "90": {
            candidate: [180, 160, 175, 135, 145, 100, 115, 65, 80],
            interview: [198, 185, 190, 172, 180, 155, 165, 142, 151],
            labels: ["15 Jul", "30 Jul", "14 Ago", "29 Ago", "13 Set", "28 Set", "12 Out"]
        }
    };

    function buildLine(values) {
        const width = 600;
        const height = 220;
        const maxValue = 220;
        const minValue = 0;

        return values.map(function (value, index) {
            const x = (index / (values.length - 1)) * width;
            const y = ((value - minValue) / (maxValue - minValue)) * height;

            return (index === 0 ? "M" : "L") +
                x.toFixed(1) + " " + y.toFixed(1);
        }).join(" ");
    }

    function updateChart(period) {
        const data = chartData[period];

        if (!data) return;

        const candidatePath = buildLine(data.candidate);
        const interviewPath = buildLine(data.interview);

        document.getElementById("candidateLine")
            .setAttribute("d", candidatePath);

        document.getElementById("interviewLine")
            .setAttribute("d", interviewPath);

        document.getElementById("areaPath")
            .setAttribute(
                "d",
                candidatePath +
                " L600 220 L0 220 Z"
            );

        const labelsContainer = document.getElementById("chartLabels");
        labelsContainer.replaceChildren();

        data.labels.forEach(function (label) {
            const span = document.createElement("span");
            span.textContent = label;
            labelsContainer.appendChild(span);
        });
    }

    chartPeriod.addEventListener("change", function () {
        updateChart(chartPeriod.value);
        showToast("Período do gráfico atualizado.");
    });

    // =========================================
    // FUNIL DE SELEÇÃO
    // =========================================

    document.getElementById("funnelInfo").addEventListener("click", function () {
        showToast(
            "Os números do funil são demonstrativos. " +
            "A versão real deve utilizar os dados do banco de dados."
        );
    });

    // =========================================
    // BOTÕES DAS VAGAS
    // =========================================

    jobsTableBody.addEventListener("click", function (event) {
        const button = event.target.closest(".row-action");

        if (!button) return;

        const row = button.closest("tr");
        const title = row.querySelector(".job-title-cell strong");

        showToast(
            "Detalhes de " +
            (title ? title.textContent : "vaga") +
            ": a tela de detalhes será integrada posteriormente."
        );
    });

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    updateChart("30");

});

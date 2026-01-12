import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { Ponto } from "../types.ts";

export const gerarExcel = async (pontos: Ponto[]) => {
  try {
    if (pontos.length === 0) {
      toast.error("Nenhum registro para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Relatório de Ponto");
    const pontosUnicos = pontos.filter(
      (ponto, index, self) => index === self.findIndex((t) => t.id === ponto.id)
    );

    workSheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Funcionário", key: "funcionario", width: 30 },
      { header: "Data", key: "data", width: 15 },
      { header: "Hora", key: "hora", width: 15 },
      { header: "Tipo", key: "tipo", width: 20 },
    ];

    const headerRow = workSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF166534" },
    };

    pontosUnicos.forEach((ponto) => {
      const data = new Date(ponto.timestamp);
      const row = workSheet.addRow({
        id: ponto.id,
        funcionario: ponto.user?.name || "Desconhecido",
        data: data.toLocaleDateString("pt-BR"),
        hora: data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tipo: ponto.type.replace("_", " "),
      });

      const tipoCell = row.getCell("tipo");
      if (ponto.type === "ENTRADA") {
        tipoCell.font = { color: { argb: "FF166534" }, bold: true };
      } else if (ponto.type === "SAIDA") {
        tipoCell.font = { color: { argb: "FF991B1B" }, bold: true };
      }
    });

    workSheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "relatorio-ponto.xlsx");
    toast.success("Excel baixado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    toast.error("Erro ao gerar Excel");
  }
};

export const gerarPDF = async (pontos: Ponto[]): Promise<void> => {
  try {
    if (pontos.length === 0) {
      toast.error("Nenhum registro para exportar");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Ponto Eletrônico", 14, 22);

    doc.setFontSize(10);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`,
      14,
      30
    );

    const dadosDaTabela = pontos.map((ponto: Ponto) => [
      ponto.id,
      ponto.user?.name,
      new Date(ponto.timestamp).toLocaleDateString("pt-BR"),
      new Date(ponto.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ponto.type.replace("_", " "),
    ]);

    autoTable(doc, {
      head: [["ID", "Funcionário", "Data", "Hora", "Tipo"]],
      body: dadosDaTabela,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 163, 74] },
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.text("Desenvolvido por Paulo Henrique", 14, pageHeight - 10);
      },
    });

    doc.save("folha-de-ponto.pdf");
    toast.success("PDF baixado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    toast.error("Erro ao gerar PDF");
  }
};

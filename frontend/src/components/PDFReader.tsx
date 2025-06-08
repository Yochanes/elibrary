import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { UPDATE_READING_PROGRESS } from '../graphql/mutations';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      pdfPath
      readingProgress
    }
  }
`;

const PDFReader: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  const [updateProgress] = useMutation(UPDATE_READING_PROGRESS);

  // Определяем размер экрана и обновляем состояние
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обновляем ширину контейнера при изменении размера окна
  useEffect(() => {
    const updateContainerWidth = () => {
      const container = document.getElementById('pdf-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const { data, loading, error } = useQuery(GET_BOOK, {
    variables: {
      id: parseInt(bookId || '0'),
    },
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  // Устанавливаем начальную страницу из прогресса чтения
  useEffect(() => {
    if (data?.book?.readingProgress) {
      setPageNumber(data.book.readingProgress);
    }
  }, [data?.book?.readingProgress]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      const finalPage = Math.min(Math.max(1, newPageNumber), numPages || 1);
      
      // Сохраняем прогресс при смене страницы
      if (bookId) {
        updateProgress({
          variables: {
            id: parseInt(bookId),
            page: finalPage,
          },
        }).catch(console.error);
      }
      
      return finalPage;
    });
  };

  const changeScale = (delta: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 2.0));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Ошибка загрузки PDF</div>;
  if (!data?.book?.pdfPath) return <div className="flex items-center justify-center min-h-screen">PDF не найден</div>;

  const pdfUrl = `http://localhost:3000/${data.book.pdfPath}`;

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-2 sm:p-4">
        {/* Верхняя панель навигации */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 bg-transparent w-full sm:w-auto justify-center sm:justify-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Назад</span>
          </Button>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              onClick={() => changeScale(-0.1)}
              disabled={scale <= 0.5}
              className="h-8 sm:h-10 px-2 sm:px-4"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <span className="text-xs sm:text-sm min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              onClick={() => changeScale(0.1)}
              disabled={scale >= 2.0}
              className="h-8 sm:h-10 px-2 sm:px-4"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Контейнер для PDF */}
        <div id="pdf-container" className="flex justify-center mb-4 overflow-x-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-center">Загрузка PDF...</div>}
            error={<div className="text-center text-red-500">Ошибка загрузки PDF</div>}
            className="max-w-full"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={<div className="text-center">Загрузка страницы...</div>}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={isMobile ? containerWidth - 32 : undefined}
              className="max-w-full"
            />
          </Document>
        </div>

        {/* Нижняя панель навигации */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="flex items-center gap-2 w-full sm:w-auto justify-center h-8 sm:h-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Предыдущая</span>
          </Button>
          <span className="text-xs sm:text-sm text-center">
            Страница {pageNumber} из {numPages || '?'}
          </span>
          <Button
            variant="outline"
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 1)}
            className="flex items-center gap-2 w-full sm:w-auto justify-center h-8 sm:h-10"
          >
            <span className="text-sm sm:text-base">Следующая</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;

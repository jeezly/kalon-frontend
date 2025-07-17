import Header from '../../components/Header/Header';
import ClassSchedule from '../../components/ClassSchedule/ClassSchedule';
import './Clases.css';

const Clases = () => {
  return (
    <div className="clases-wrapper">
      <Header />
      
      <main className="clases-main">
        <div className="clases-hero">
          <h1>Horario de Clases</h1>
          <p>Encuentra y reserva tu clase ideal</p>
        </div>
        
        <div className="clases-layout">
          <div className="schedule-main">
            <ClassSchedule />
          </div>
          
          <div className="clases-tips">
            <div className="tips-card">
              <h3>Tips para tu clase</h3>
              <ul>
                <li>Llega 10 minutos antes</li>
                <li>Usa ropa cómoda y ajustada</li>
                <li>Trae una toalla pequeña</li>
                <li>Hidrátate bien durante el día</li>
                <li>Evita comer pesado 1 hora antes</li>
                <li>Disfruta el proceso</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clases;
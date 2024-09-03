import { Col, Image, Modal, Row } from "antd"
import { useRef, useState } from "react";
import ReactImageGallery from "react-image-gallery";

const ModalViewImage = (props) => {

    const {
        isOpen, setIsOpen, currentIndex, setCurrentIndex, items, title
    } = props

    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef(null);

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Modal 
            title={''} 
            width={'70vw'}
            open={isOpen} 
            onCancel={handleCancel}
            footer={null} //hide footer
            closable={false} //hide close button
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ReactImageGallery                       
                        ref={refGallery}
                        items={items}
                        showPlayButton={false} //hide play button
                        showFullscreenButton={false} //hide fullscreen button
                        startIndex={currentIndex} // start at current index
                        showThumbnails={false} //hide thumbnail
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0} //duration between slices
                    />
                </Col>

                <Col span={8}>
                    <div>{title}</div>
                    <div>
                        <Row gutter={[20,20]}>
                            {
                                items?.map((item, index) => {
                                    return (
                                        <Col key={`image-${index}`}>
                                            <Image
                                                wrapperClassName={"img-normal"}
                                                width={120}
                                                height={120}
                                                src={item.original}
                                                onClick={() => {
                                                    refGallery.current.slideToIndex(i);
                                                }}
                                            />
                                            <div className={activeIndex === index ? "active" : ""}></div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalViewImage
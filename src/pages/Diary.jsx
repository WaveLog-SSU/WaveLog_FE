import React, {useState} from "react";
import "./index.css"
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	return (
		<div className="contain">
			<div className="scroll-view">
				<div className="view">
					<span className="text" >
						{"SCRAP"}
					</span>
				</div>
				<div className="row-view">
					<div className="view2">
						<span className="text2" >
							{"frintf..."}
						</span>
					</div>
					<div className="column">
						<span className="text3" >
							{"CATEGORY"}
						</span>
						<span className="text4" >
							{"YY.MM.DD"}
						</span>
						<input
							placeholder={"하하하"}
							value={input1}
							onChange={(event)=>onChangeInput1(event.target.value)}
							className="input"
						/>
						<div className="row-view2">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/w6utvv66_expires_30_days.png"} 
								className="image"
							/>
							<span className="text5" >
								{"9999+"}
							</span>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/zwn7fn7c_expires_30_days.png"} 
								className="image2"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/nrv9vqn5_expires_30_days.png"} 
								className="image3"
							/>
						</div>
						<div className="row-view3">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Pj2S5T474o/na90t6d2_expires_30_days.png"} 
								className="image"
							/>
							<span className="text6" >
								{"아이디"}
							</span>
							<span className="text7" >
								{"댓글"}
							</span>
						</div>
						<div className="row-view4">
							<span className="text7" >
								{"아이디"}
							</span>
							<span className="text7" >
								{"댓글"}
							</span>
						</div>
						<div className="row-view5">
							<span className="text7" >
								{"아이디"}
							</span>
							<span className="text7" >
								{"댓글"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}